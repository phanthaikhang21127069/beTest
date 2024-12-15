import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Bank } from './bank.schema';
import mongoose, { HydratedDocument, Model } from 'mongoose';
import { AccountInfo } from './account_info.schema';

export type PaymentAccountDocument = HydratedDocument<PaymentAccount>;

@Schema({
  collection: 'Payment_Account',
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
})
export class PaymentAccount extends Model {
  @Prop({
    type: mongoose.Schema.Types.Number
  })
  paid: number

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account_Info'
  })
  user_id: AccountInfo

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bank'
  })
  bank_id: Bank

  @Prop({
    type: mongoose.Schema.Types.Number
  })
  account_balance: number
}

export const PaymentAccountSchema = SchemaFactory.createForClass(PaymentAccount);