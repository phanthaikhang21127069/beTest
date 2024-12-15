import { Bank } from './bank.schema';
import { AccountInfo } from './account_info.schema';
import mongoose, { HydratedDocument, Model } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type TransactionHistoryDocument = HydratedDocument<TransactionHistory>;

@Schema({
  collection: 'Transaction_History',
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
})
export class TransactionHistory extends Model {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bank'
  })
  bank_sender_id: Bank

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bank'
  })
  bank_recipient_id: Bank

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account_Info'
  })
  sender_id: AccountInfo

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account_Info'
  })
  recipient_id: AccountInfo

  @Prop({
    type: mongoose.Schema.Types.String,
    enum: ['Sender Pay', 'Recipient Pay']
  })
  payment_method: string

  @Prop({
    type: mongoose.Schema.Types.Number
  })
  amount: number

  @Prop({
    type: mongoose.Schema.Types.Date
  })
  transaction_date: Date

  @Prop({
    type: mongoose.Schema.Types.Boolean
  })
  isInterBank_transaction: boolean

  @Prop({
    type: mongoose.Schema.Types.String,
    enum: ['Canceled', 'Success', 'Pending']
  })
  status: string

  @Prop({
    type: mongoose.Schema.Types.String
  })
  remarks: string
}

export const TransactionHistorySchema = SchemaFactory.createForClass(TransactionHistory);