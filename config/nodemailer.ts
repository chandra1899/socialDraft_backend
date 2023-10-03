// const nodemailer=require('nodemailer');
import nodemailer from 'nodemailer'
//creating transporter for mailing
let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.AUTH_MAILER_EMAIL as string,
        pass: process.env.AUTH_MAILER_PASS as string
    }

  });

  export default {
    transporter: transporter
}