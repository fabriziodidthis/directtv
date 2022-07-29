import { getModelForClass, modelOptions, prop, Ref, Severity } from "@typegoose/typegoose";
import { User } from "./user.model";

@modelOptions({
  schemaOptions:{
    timestamps: true,
    toJSON:{virtuals: true}
  },
  options:{
    allowMixed: Severity.ALLOW
  }
})
export class Session {
  @prop({
    ref: ()=> User
  })
  user: Ref<User>

  @prop({
    default: true
  })
  valid: boolean
}

const SessionModel = getModelForClass(Session)

export default SessionModel