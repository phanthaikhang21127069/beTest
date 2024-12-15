import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import mongoose, { HydratedDocument, Model } from "mongoose"
import { VERTIFICATION_CONSTANTS } from "src/utils/constants/verification.constants";

export type OTPDocument = HydratedDocument<OTP>;

@Schema({
  collection: 'OTP'
})
export class OTP extends Model {
  @Prop({
    type: mongoose.Schema.Types.String
  })
  email: string

  @Prop({
    type: mongoose.Schema.Types.String
  })
  hashed_otp: string

  @Prop({
    type: mongoose.Schema.Types.String,
    default: ""
  })
  token: string

  @Prop({
    type: mongoose.Schema.Types.Date,
    default: new Date()
  })
  created_at: Date
}

export const OTPSchema = SchemaFactory.createForClass(OTP);