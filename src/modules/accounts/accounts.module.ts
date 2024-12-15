import { Module } from "@nestjs/common";
import { AccountsService } from "./accounts.service";
import { AccountInfo, AccountInfoSchema } from "src/schemas/account_info.schema";
import { PaymentAccount, PaymentAccountSchema } from "src/schemas/payment_account.schema";
import { AccountsController } from "./accounts.controller";
import { JwtModule } from "@nestjs/jwt";
import { APP_GUARD } from "@nestjs/core";
import { MailerModule } from '@nestjs-modules/mailer'
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import { AccessAuthGuard } from "src/auth/access.guard";
import { OTP, OTPSchema } from "src/schemas/otp.schema";
import { AUTH_CONSTANTS } from "src/utils/constants/auth.constants";

@Module({
    imports: [
        ConfigModule.forRoot({}),
        MongooseModule.forFeature([
            { name: AccountInfo.name, schema: AccountInfoSchema },
            { name: PaymentAccount.name, schema: PaymentAccountSchema },
            { name: OTP.name, schema: OTPSchema }
        ]),
        MailerModule.forRoot({
            transport: {
                host: process.env.OTP_HOST,
                port: parseInt(process.env.OTP_PORT),
                secure: false,
                auth: {
                    user: process.env.OTP_USER,
                    pass: process.env.OTP_PASS
                }
            }
        }),
        JwtModule.register({
            global: true,
            secret: process.env.JWT_ACCESS_SECRET,
            signOptions: { expiresIn: AUTH_CONSTANTS.JWT_ACCESS_EXPIRY_MINUTES * 60 }
        })
    ],
    controllers: [AccountsController],
    providers: [
        AccountsService
    ]
})
export class AccountsModule {}