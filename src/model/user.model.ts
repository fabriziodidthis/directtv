import { DocumentType, getModelForClass, index, modelOptions, pre, prop, Severity, Ref } from "@typegoose/typegoose";
import argo2 from "argon2";
import mongoose from "mongoose";
import { randomUUID } from 'node:crypto'
import log from "../utils/logger";

enum enumPhoneNumberType {
  LANDLINE = 'landline',
  TOLLFREE = 'tollfree',
  MOBILE = 'mobile',
  BUSINESS = 'business'
}

// Handling the password
@pre<User>('save',  async function(){
  if(!this.isModified('password')){
    return
  }

  const hashPassword = await argo2.hash(this.password)
  this.password = hashPassword

  return
})

// Sanitizing, slicing the phoneNumber and assigning to theirs corresponding variables
@pre<User>('save', function(){
  this.areaCode = this.phoneNumber.replace(/\D/g,'').trim().slice(0,2)
  this.number = this.phoneNumber.replace(/\D/g,'').trim().slice(2)
  this.phoneNumber = this.phoneNumber.replace(/\D/g,'').trim()
  const phoneObj = {
    DDD: this.areaCode,
    number: this.number,
    phoneNumberType: this.phoneNumberType
  }
  this.phones.push(phoneObj)
})

@index({email: 1})
@modelOptions({
  schemaOptions:{
    timestamps: true,
    toJSON:{virtuals: true}
  },
  options:{
    allowMixed: Severity.ALLOW
  }
})
export class User {
  @prop({
    lowercase: true,
    required: true,
    unique: true
  })
  email: string

  @prop({
    required: true
  })
  fullName: string

  @prop()
  areaCode: string

  @prop()
  number: string

  @prop()
  phoneNumber:string

  @prop({
    enum: enumPhoneNumberType
  })
  phoneNumberType: enumPhoneNumberType

  @prop()
  phones: mongoose.Types.Array<string>

  @prop({
    required: true
  })
  password: string
  
  @prop()
  passwordResetCode: string | null

  @prop({
    required: true,
    default: () => randomUUID()
  })
  verificationCode: string 
  
  @prop({
    default: false
  })
  verifiedUser: boolean

  async validatePassword(this: DocumentType<User>, candidatePassword: string){
    try {
      return await argo2.verify(this.password, candidatePassword)
    } catch (error) {
      log.error('Error on password validation', error)
      return false
    }
  }
}

const UserModel = getModelForClass(User)
export default UserModel