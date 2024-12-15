import { Module } from "@nestjs/common";
import { DebtService } from "./debt.service";
import { Debt, DebtSchema } from "src/schemas/debt.schema";
import { DebtController } from "./debt.controller";
import { JwtModule } from "@nestjs/jwt";
import { APP_GUARD } from "@nestjs/core";
import { MongooseModule } from "@nestjs/mongoose";
import { AccessAuthGuard } from "src/auth/access.guard";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Debt.name, schema: DebtSchema }]),
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: 60 } 
        })
    ],
    controllers: [DebtController],
    providers: [
        DebtService
    ]
})
export class DebtModule {}