const nodemailer=require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    // proxy: 'http://172.31.2.4:8080',
    auth: {
        user: 'c4746665@gmail.com',//'c4746665@gmail.com',
        pass: 'jxhbauiwdmukmqme'//'jxhbauiwdmukmqme'
    }

  });

  module.exports = {
    transporter: transporter
}