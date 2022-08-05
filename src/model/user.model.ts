import { DocumentType, getModelForClass, index, modelOptions, pre, prop, Severity, PropType } from "@typegoose/typegoose";
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

class PhonesNumbers {
  @prop()
  DDD: string

  @prop()
  number: string

  @prop({
    enum: enumPhoneNumberType,
  })
  phoneNumberType: enumPhoneNumberType
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

// Sanitizing, slicing phoneNumber and assigning to corresponding variables
@pre<User>('save', function(){
  const phoneObj: PhonesNumbers = {
    DDD: this.phoneNumber.replace(/\D/g,'').trim().slice(0,2),
    number: this.phoneNumber.replace(/\D/g,'').trim().slice(2),
    phoneNumberType: this.phoneNumberType
  }
  this.phones.push(phoneObj)
})

// Sanitizing phoneNumber
@pre<User>('save', function(){
  this.phoneNumber = this.phoneNumber.replace(/\D/g,'').trim()
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

  @prop({
    required: true
  })
  phoneNumber:string

  @prop({
    required: true,
    enum: enumPhoneNumberType
  })
  phoneNumberType: enumPhoneNumberType
  
  @prop({
    type: () => [PhonesNumbers],
    _id: false
  })
  phones: mongoose.Types.DocumentArray<object>

  @prop({
    required: true
  })
  password: string
  
  @prop()
  passwordResetCode: string | null

  @prop({
    required: true,
    default: () => randomUUID().slice(0,8)
  })
  verificationCode: string 
  
  @prop({
    default: false
  })
  verifiedUser: boolean

  @prop({
    default: Date.now()
  })
  lastLogin: Date

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