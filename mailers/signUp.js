const nodemailer=require('../config/nodemailer');

module.exports.signUp = async(email) => {
    // console.log('inside newComment mailer', comment);
   
   try {
    let info=await nodemailer.transporter.sendMail({
        from: 'c4746665@gmail.com',
        to: email,
        subject: "Thank You",
        html: `Succesfully register on SocialMedia`
     });
     console.log('mail sent',info);
     return ;
   } catch (error) {
    console.log('error in sendind mail',error);
   }
    
}