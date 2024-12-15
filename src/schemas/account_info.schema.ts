import { PaymentAccount, PaymentAccountSchema } from './payment_account.schema';
import { Debt } from './debt.schema';
import mongoose, { HydratedDocument, Model } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Bank, BankDocument, BankSchema } from './bank.schema';
import { MAIN_CONSTANTS } from 'src/utils/constants/main.constants';

export type AccountInfoDocument = HydratedDocument<AccountInfo>;

@Schema({
  collection: 'Account_Info',
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
})
export class AccountInfo extends Model {
  @Prop({
    type: mongoose.Schema.Types.String,
    enum: ['Admin', 'Employee', 'Customer'],
    default: 'Customer'
  })
  role: string

  @Prop({
    type: mongoose.Schema.Types.String,
    unique: true
  })
  username: string

  @Prop({
    type: mongoose.Schema.Types.String
  })
  password: string

  @Prop({
    type: mongoose.Schema.Types.String
  })
  name: string

  @Prop({
    type: mongoose.Schema.Types.String,
    unique: true
  })
  email: string

  @Prop({
    type: mongoose.Schema.Types.String
  })
  phone: string

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment_Account'
  })
  payment_account_id: PaymentAccount

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Account_Info' }],
    default: []
  })
  recipient_list: AccountInfo[]

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Debt' }],
    default: []
  })
  inDebt_list: Debt[]

  @Prop({
    type: mongoose.Schema.Types.Boolean,
    default: false
  })
  isDeleted: boolean

  @Prop({
    type: mongoose.Schema.Types.String,
    default: ""
  })
  refresh_token: string
}

export const AccountInfoSchema = SchemaFactory.createForClass(AccountInfo);

/* Hooks */
// Post-save hook: Creating a payment account for the new account
AccountInfoSchema.post('save', async function (doc, next) {
  if (doc.payment_account_id != null) {
    next()
    return
  }

  const bankModel = this.model('Bank')
  const paymentAccountModel = this.model('PaymentAccount')

  const currentBank = await bankModel.findOne({
    name: MAIN_CONSTANTS.BANK_NAME
  })

  const createdPaymentAccount = await paymentAccountModel.create({
    paid: 0,
    user_id: doc,
    bank_id: currentBank,
    account_balance: 0
  })
  
  doc.payment_account_id = createdPaymentAccount.id
  doc.save()
  next()
})