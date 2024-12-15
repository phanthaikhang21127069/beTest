import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AccountInfo } from "src/schemas/account_info.schema";
import { Bank } from "src/schemas/bank.schema";
import { Debt } from "src/schemas/debt.schema";
import { PaymentAccount } from "src/schemas/payment_account.schema";
import { TransactionHistory } from "src/schemas/transaction_history.schema";

@Module({
    imports: [
        ConfigModule.forRoot({}),
        MongooseModule.forRoot(process.env.MONGO_URL, {
            autoCreate: true
        }),
    ]
})
export class DatabaseModule {}