// const nodemailer=require('../config/nodemailer');
import nodemailer from '../config/nodemailer'

const sendOtp = async(email:string,otp:string) => {   
   try {
    let info=await nodemailer.transporter.sendMail({
        from: process.env.AUTH_MAILER_EMAIL,
        to: email,
        subject: "OTP",
        html: `your otp = ${otp}`
     });
     console.log('mail sent',info);
     return ;
   } catch (error) {
    console.log('error in sendind mail',error);
   }
    
}
export default sendOtp