import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService, TokenExpiredError } from "@nestjs/jwt";
import { CreateAccountDto, ForgetPasswordDto, ChangePasswordDto, SignInDto, VerifyForgetPasswordOtpDto, UpdateInfoDto } from "src/dtos/account.dto";
import { AccountInfo } from "src/schemas/account_info.schema";
import * as bcrypt from "bcrypt";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { generateOtp } from "src/utils/vertification/otp.vertification";
import { MailerService } from "@nestjs-modules/mailer";
import { VERTIFICATION_CONSTANTS } from "src/utils/constants/verification.constants";
import { OTP } from "src/schemas/otp.schema";
import { AUTH_CONSTANTS } from "src/utils/constants/auth.constants";
import { PaymentAccount } from "src/schemas/payment_account.schema";

@Injectable()
export class AccountsService {
    constructor(
        @InjectModel(AccountInfo.name)
        private accountInfoModel: Model<AccountInfo>,
        @InjectModel(PaymentAccount.name)
        private paymentAccountModel: Model<PaymentAccount>,
        @InjectModel(OTP.name)
        private otpModel: Model<OTP>,
        private jwtService: JwtService,
        private mailerService: MailerService
    ) {}

    async signIn(signInDto: SignInDto): Promise<{ access_token: string, refresh_token: string }> {
        const searchUser = await this.accountInfoModel.findOne({
            email: signInDto.email
        });

        if (!searchUser)
            throw new UnauthorizedException();

        let comparePasswordHash = await bcrypt.compare(signInDto.password, searchUser.password)

        if (!comparePasswordHash)
            throw new UnauthorizedException();

        const payload = { sub: searchUser.id, username: searchUser.username, role: searchUser.role }
        const access_token = await this.jwtService.signAsync(payload)
        const refresh_token = await this.jwtService.signAsync(payload, { 
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: AUTH_CONSTANTS.JWT_REFRESH_EXPIRY_DAYS * 60 * 60 * 24 
        })
        // Save refresh_token
        await this.accountInfoModel.updateOne({
            email: signInDto.email
        }, {
            refresh_token: refresh_token
        })
        return {
            access_token: access_token,
            refresh_token: refresh_token
        }
    }

    async refreshTokens(refreshToken: string): Promise<{ access_token: string, refresh_token: string }> {
        try {
            const decoded = await this.jwtService.verifyAsync(refreshToken); // Verify the refresh token
            const payload = { username: decoded.username, sub: decoded.sub, role: decoded.role };
            const newAccessToken = await this.jwtService.signAsync(payload);
            const newRefreshToken = await this.jwtService.signAsync(payload, { 
                secret: process.env.JWT_REFRESH_SECRET,
                expiresIn: AUTH_CONSTANTS.JWT_REFRESH_EXPIRY_DAYS * 60 * 60 * 24
            })
            // Update new refresh token
            await this.accountInfoModel.findByIdAndUpdate(payload.sub, {
                refresh_token: newRefreshToken
            })

            return {
                access_token: newAccessToken,
                refresh_token: newRefreshToken
            };
        } catch (error) {
            throw new HttpException('Invalid or expired refresh token', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async sendForgetPasswordOTP(email: string): Promise<boolean> {
        const searchUserByEmail = await this.accountInfoModel.findOne({
            email: email
        })
        if (!searchUserByEmail)
            throw new HttpException("Email not used by any users", HttpStatus.INTERNAL_SERVER_ERROR)
        
        const otp = generateOtp()

        try {
            // Send OTP via email
            await this.mailerService.sendMail({
                to: email,
                from: VERTIFICATION_CONSTANTS.OTP_SENDER_EMAIL,
                subject: VERTIFICATION_CONSTANTS.OTP_MAIL_SUBJECT,
                html: `
                    <p>Hello <b>${email}</b></p>
                    <p>You have requested a password restoration process for your account. Here's the OTP required to begin the process:</p>
                    <h1>${otp}</h1>
                    <p>Enter the OTP in the prompt.</p>
                    <p>This code will expire ${VERTIFICATION_CONSTANTS.OTP_EXPIRE_HOURS} hours after this email was sent.</p>
                `
            })
        } catch (err) {
            console.error(err)

            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        
        try {
            // Store OTP in database
            let hashedOtp = await bcrypt.hash(otp, 10);

            // Overwrite if alrd existing
            const foundOldOTP = await this.otpModel.findOne({
                email: email
            })
            .sort({ created_at: -1 })
            .exec()
            if (foundOldOTP) {
                foundOldOTP.hashed_otp = hashedOtp
                await foundOldOTP.save()
            }
            // Otherwise create new
            else
                await this.otpModel.create({
                    email: email,
                    hashed_otp: hashedOtp,
                    timestamp: new Date()
                })
        } catch (err) {
            console.error(err)

            throw new HttpException("Failed to store OTP in database", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return true;
    }

    async verifyForgetPasswordOTP(dto: VerifyForgetPasswordOtpDto): Promise<{ success: boolean, message: string, token: string }> {
        const foundOTP = await this.otpModel.findOne({
            email: dto.email
        })
        .sort({ created_at: -1 })
        .exec()

        if (!foundOTP)
            return {
                success: false,
                message: "Your account has not requested an OTP",
                token: ""
            }

        const otpCheck = await bcrypt.compare(dto.otp, foundOTP.hashed_otp)
        
        const timeDiff = (new Date().getTime() - foundOTP.created_at.getTime()) / (1000 * 60 * 60)
        if (otpCheck && timeDiff > VERTIFICATION_CONSTANTS.OTP_EXPIRE_HOURS) {
            return {
                success: false,
                message: "OTP expired",
                token: ""
            }
        }
        else if (foundOTP.token != "") {
            return {
                success: true,
                message: "",
                token: foundOTP.token
            }
        }
        let token = ""
        if (otpCheck) {
            token = await this.jwtService.signAsync(dto, {
                expiresIn: VERTIFICATION_CONSTANTS.OTP_EXPIRE_HOURS * 60 * 60
            })

            foundOTP.token = token
            await foundOTP.save()
        }
        
        return {
            success: otpCheck,
            message: "",
            token: token
        }
    }

    async changePassword(dto: ChangePasswordDto): Promise<AccountInfo> {
        const updatedUser = await this.accountInfoModel.findOneAndUpdate({
            email: dto.email,
            password: dto.hashed_password
        })

        return updatedUser
    }

    async getPaymentAccountInfo(user_id: string): Promise<PaymentAccount> {
        const found = await this.accountInfoModel.findById(user_id).populate('payment_account_id', '', this.paymentAccountModel)
        return found.payment_account_id
    }

    async updateInfo(user_id: string, info: UpdateInfoDto): Promise<boolean> {
        const updateQuery = {}
        
        if (info.name)
            updateQuery['name'] = info.name
        if (info.email)
            updateQuery['email'] = info.email
        if (info.phone)
            updateQuery['phone'] = info.phone
        const foundAndUpdatedUser = await this.accountInfoModel.findByIdAndUpdate(user_id, updateQuery)

        if (foundAndUpdatedUser)
            return true
        return false
    }

    // TODO: MOVE THIS TO EMPLOYEE'S API AND RESTRICT ACCESS
    async create(createDto: CreateAccountDto): Promise<AccountInfo> {
        let hashedPassword = await bcrypt.hash(createDto.password, 10);

        return await this.accountInfoModel.create({
            role: createDto.role,
            username: createDto.username,
            password: hashedPassword,
            name: createDto.name,
            email: createDto.email,
            phone: createDto.phone,
            payment_account: null
        })
    }

    // async getAll()
}