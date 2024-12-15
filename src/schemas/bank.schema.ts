import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import mongoose, { HydratedDocument, Model } from "mongoose"

export type BankDocument = HydratedDocument<Bank>;

@Schema({
  collection: 'Bank',
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
})
export class Bank extends Model {
  @Prop({
    type: mongoose.Schema.Types.String
  })
  name: string

  @Prop({
    type: [mongoose.Schema.Types.String]
  })
  white_list_ip: string[]

  @Prop({
    type: mongoose.Schema.Types.String
  })
  private_key: string

  @Prop({
    type: mongoose.Schema.Types.String
  })
  partner_public_key: string
}

export const BankSchema = SchemaFactory.createForClass(Bank);