import { Module } from "@nestjs/common";
import { BanksService } from "./banks.service";
import { Bank, BankSchema } from "src/schemas/bank.schema";
import { BanksController } from "./banks.controller";
import { JwtModule } from "@nestjs/jwt";
import { APP_GUARD } from "@nestjs/core";
import { MongooseModule } from "@nestjs/mongoose";
import { AccessAuthGuard } from "src/auth/access.guard";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Bank.name, schema: BankSchema }]),
        JwtModule.register({
            global: true,
            secret: process.env.JWT_CUSTOMER_SECRET,
            signOptions: { expiresIn: 60 } 
        })
    ],
    controllers: [BanksController],
    providers: [
        BanksService
    ]
})
export class BanksModule {}