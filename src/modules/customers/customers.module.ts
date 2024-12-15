import { Module } from "@nestjs/common";
import { CustomersService } from "./customers.service";
import { AccountInfo, AccountInfoSchema } from "src/schemas/account_info.schema";
import { PaymentAccount, PaymentAccountSchema } from "src/schemas/payment_account.schema";
import { CustomersController } from "./customers.controller";
import { JwtModule } from "@nestjs/jwt";
import { APP_GUARD } from "@nestjs/core";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import { AccessAuthGuard } from "src/auth/access.guard";

@Module({
    imports: [
        ConfigModule.forRoot({}),
        MongooseModule.forFeature([
            { name: AccountInfo.name, schema: AccountInfoSchema },
            { name: PaymentAccount.name, schema: PaymentAccountSchema }
        ]),
        JwtModule.register({
            global: true,
            secret: process.env.JWT_CUSTOMER_SECRET,
            signOptions: { expiresIn: 60 }
        })
    ],
    controllers: [CustomersController],
    providers: [
        CustomersService
    ]
})
export class CustomersModule {}