// const nodemailer=require('../config/nodemailer');
import nodemailer from '../config/nodemailer'

const signUp = async(email:string) => {
   
   try {
    let info=await nodemailer.transporter.sendMail({
        from:process.env.AUTH_MAILER_EMAIL,
        to: email,
        subject: "Thank You",
        html: `Succesfully register on SocialMedia`
     });
     return ;
   } catch (error) {
    console.log('error in sendind mail',error);
   }
    
}
export default signUp