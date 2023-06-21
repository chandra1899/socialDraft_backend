const nodemailer=require('../config/nodemailer');

module.exports.newPost = (post) => {
   
    nodemailer.transporter.sendMail({
       from: 'c4746665@gmail.com',
       to: 'c4746665@gmail.com',
       subject: "New Post Published!",
       html: 'post published'
    }, (err, info) => {
        if (err){
            console.log('Error in sending mail', err);
            return;
        }

        console.log('Message sent', info);
        return;
    });
}