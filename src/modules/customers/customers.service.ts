import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CreateAccountDto, SignInDto } from "src/dtos/account.dto";
import { AccountInfo } from "src/schemas/account_info.schema";
import * as bcrypt from "bcrypt";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class CustomersService {
    constructor(
        @InjectModel(AccountInfo.name)
        private accountInfoModel: Model<AccountInfo>,
        private jwtService: JwtService
    ) {}

    async signIn(signInDto: SignInDto): Promise<{ access_token: string }> {
        const searchUser = await this.accountInfoModel.findOne({
            email: signInDto.email
        });

        if (!searchUser)
            throw new UnauthorizedException();

        let comparePasswordHash = await bcrypt.compare(signInDto.password, searchUser.password)

        if (!comparePasswordHash)
            throw new UnauthorizedException();

        const payload = { sub: searchUser.id, username: searchUser.username }
        return {
            access_token: await this.jwtService.signAsync(payload)
        }
    }

    async create(createDto: CreateAccountDto): Promise<AccountInfo> {
        let hashedPassword = await bcrypt.hash(createDto.password, 10);

        return await this.accountInfoModel.create({
            role: createDto.role,
            username: createDto.username,
            password: hashedPassword,
            name: createDto.name,
            email: createDto.email,
            phone: createDto.phone,
            payment_account: null,
            recipient_list: [],
            inDebt_list: [],
            isDeleted: false
        })
    }

    // async getAll()
}