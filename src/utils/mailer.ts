import nodemailer, { SendMailOptions} from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import log from './logger'

const smtpHost = process.env.SMTP_HOST
const smtpPort = process.env.SMTP_PORT
const smtpSecurity = process.env.SMTP_SECURITY
const smtpUser = process.env.EMAIL_USER
const smtpPassword = process.env.EMAIL_PASSWORD

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: !smtpSecurity,
  auth:{
    user: smtpUser,
    pass: smtpPassword
  }
} as SMTPTransport.Options )
 
const sendEmail = async (payload: SendMailOptions) => {
  transporter.sendMail(payload, (error, info) => {
    if(error){
      log.error(error, 'Error sending email')
      return
    }

    log.info(`Preview URL ${nodemailer.getTestMessageUrl(info)}`)
  })
}

export default sendEmail