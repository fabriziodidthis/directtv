import {Request, Response} from 'express'
import {randomUUID} from 'node:crypto'
import { CreateUserInput, ForgotPasswordInput, ResetPasswordInput, VerifyUserInput } from '../schema/user.schema';
import { createUser, findUserByEmail, findUserByID } from '../service/user.service';
import log from '../utils/logger';
import  sendEmail  from '../utils/mailer';

/**
 * The main handler to create and validate the inputs to create an user
 * @param request takes the 'CreateUserInput' to validate the input
 * @param response 
 * @returns an email sent, a creation of an user or error
 */
export async function createUserHandler(request: Request<{}, {}, CreateUserInput>, response: Response  ) {
  const body = request.body

  try {
    const user = await createUser(body)

    await sendEmail({
      from: 'noreply@email.com',
      to: user.email,
      subject: 'Testing email purpose',
      text: `Use these codes to verify your account:
      Verification code - ${user.verificationCode}
      ID - ${user._id}
      `
    })

    return response.status(201).json({
      message: 'User created',
      user
    })
  } catch (error: any) {
    // Unique constraint violated
    if(error.code === 11000){
      return response.status(409).json({
        message: 'This email address has been used already.'
      })
    }
    return response.status(500).json({
      message: 'Server returned with error',
      error: error.message
    })
  }
}

/**
 * verifyUserHandler - to make sure this user is not a bot, the just created user will need to confirm its sign up action using the ID and verification code sent to the email
 * @param request takes the 'VerifyUserInput' to validate both ID and verification code to verify and authenticate user's email address
 * @param response 
 * @returns a boolean value to change the 'verifiedUser' to true after its verification
 */
export async function verifyUserHandler(request: Request<VerifyUserInput>, response: Response)  {
  const id = request.params.id
  const verificationCode = request.params.verificationCode

  // Finding a user by ID
  const user = await findUserByID(id)
  if(!user) {
    return response.status(404).json({
      message: 'Are you sure this user is here?'
    })
  }

  // If the user is already verified
  if(user.verifiedUser){
    return response.status(200).json({
      message: 'User is already verified'
    })
  }

  // If verification code matches
  if(user.verificationCode === verificationCode){
    user.verifiedUser = true
    
    await user.save()

    return response.status(200).json({
      message: 'User successfully verified'
    })
  }

  // If verification fails
  return response.status(200).json({
    message: 'Can you double check the codes?'
  })

}

/**
 * forgotPasswordHandler - handler to send an email when the user forgot their password and requests its change
 * @param request takes the 'ForgotPasswordInput' as an input validator for the email address
 * @param response 
 * @returns an email if there is an user with the email address inserted of notifies the user if the user is verified or not and then, send an email with a password reset code to allow the user to change their password
 */
export async function forgotPasswordHandler(request: Request<{}, {}, ForgotPasswordInput>, response: Response) {
  const {email} = request.body
  const message = `If there is an user with the email - ${email}, soon you will receive a password reset email.`
  const user = await findUserByEmail(email)

  if(!user){
    log.debug(`user with email ${email} does not exist`)
    return response.status(200).json({
      message: message
    })
  }

  if(!user.verifiedUser){
    return response.status(200).json({
      message: 'User is not verified'
    })
  }

  const passwordResetCode = randomUUID()
  user.passwordResetCode = passwordResetCode
  await user.save()

  await sendEmail({
    to: user.email,
    from: 'noreply@email.com',
    subject: 'Reset your password',
    text: `Hello! 
    These are the codes needed to reset your password:
    Password reset code - ${passwordResetCode}
    ID - ${user._id}
    `
  })

  log.debug(`Password reset email sent to - ${email}`)

  return response.status(200).json({
    message: message
  })
}

/**
 * Get the user ID and user password reset code from params,
 * new user password and new user password confirmation from body and set new password
 * @param request 
 * @param response 
 * @returns a confirmation message that the user's password has been changed
 */
export async function resetPasswordHandler(
  request: 
  Request<ResetPasswordInput['params'],
  {},
  ResetPasswordInput['body']>, 
  response: Response){
  const {id, passwordResetCode} = request.params
  const {password} = request.body

  const user = await findUserByID(id)

  // !user - is this user registered?
  // user.passwordResetCode - does this user has a password reset code pending?
  // user.passwordResetCode !== passwordResetCode - if the code entered does not match with the code sent
  if(!user || !user.passwordResetCode || user.passwordResetCode !== passwordResetCode){
    console.log(user , user.passwordResetCode, passwordResetCode, id)
    return response.status(400).json({
      message: 'Something went wrong to reset this user password.',
      user:user ,
      resetCode: user.passwordResetCode, 
      passwordresetcode: passwordResetCode, 
      id: id
    })
  }

  // Nulling the reset code, to not be used again
  user.passwordResetCode = null

  // Set the new password
  // No need to hash this password due the @pre hook in the User model
  user.password = password

  await user.save()

  return response.status(200).json({
    message: 'Password has been changed successfully'
  })
}


/*
export async function resetPasswordHandler(
  req: Request<ResetPasswordInput["params"], {}, ResetPasswordInput["body"]>,
  res: Response
) {
  const { id, passwordResetCode } = req.params;

  const { password } = req.body;

  const user = await findUserByID(id);

  if (
    !user ||
    !user.passwordResetCode ||
    user.passwordResetCode !== passwordResetCode
  ) {
    return res.status(400).send("Could not reset user password");
  }

  user.passwordResetCode = null;

  user.password = password;

  await user.save();

  return res.send("Successfully updated password");
}
*/