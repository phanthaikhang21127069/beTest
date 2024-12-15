import { Module } from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import { Debt, DebtSchema } from "src/schemas/debt.schema";
import { TransactionController } from "./transaction.controller";
import { JwtModule } from "@nestjs/jwt";
import { APP_GUARD } from "@nestjs/core";
import { MongooseModule } from "@nestjs/mongoose";
import { TransactionHistory, TransactionHistorySchema } from "src/schemas/transaction_history.schema";
import { AccessAuthGuard } from "src/auth/access.guard";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: TransactionHistory.name, schema: TransactionHistorySchema }]),
        JwtModule.register({
            global: true,
            secret: process.env.JWT_CUSTOMER_SECRET,
            signOptions: { expiresIn: 60 } 
        })
    ],
    controllers: [TransactionController],
    providers: [
        TransactionService
    ]
})
export class TransactionModule {}