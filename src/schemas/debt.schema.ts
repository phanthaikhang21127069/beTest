import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AccountInfo } from './account_info.schema';
import mongoose, { HydratedDocument, Model } from 'mongoose';

export type DebtDocument = HydratedDocument<Debt>;

@Schema({
  collection: 'Debt',
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
})
export class Debt extends Model {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account_Info'
  })
  owner_id: AccountInfo 

  @Prop({
    type: mongoose.Schema.Types.Number
  })
  inDebt_paid: number

  @Prop({
    type: mongoose.Schema.Types.Number
  })
  amount: number

  @Prop({
    type: mongoose.Schema.Types.String
  })
  detail: string

  @Prop({
    type: mongoose.Schema.Types.String,
    enum: ['Canceled', 'Success', 'Pending']
  })
  status: string

  @Prop({
    type: mongoose.Schema.Types.Boolean
  })
  isDeleted: boolean
}

export const DebtSchema = SchemaFactory.createForClass(Debt);