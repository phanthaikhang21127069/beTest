import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AccountsModule } from './modules/accounts/accounts.module';
import { DatabaseModule } from './shared/database/database.module';
import { BanksModule } from './modules/banks/banks.module';
import { DebtModule } from './modules/debt/debt.module';
import { TransactionModule } from './modules/transaction/transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    DatabaseModule,
    AccountsModule,
    BanksModule,
    DebtModule,
    TransactionModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
