var express = require('express');
var nodemailer = require('nodemailer');

var app = express();
app.set('view engine', 'ejs');

/*---------------Index Routing--------------------*/

app.get('/', (req,res)=>{
  res.render('index');
});


app.listen(3000, () =>{ console.log("Server listening on port 3000 !")});

/*---------------SMTP Email Functions--------------------*/
let host = 'ec2-18-219-163-99.us-east-2.compute.amazonaws.com';

function sendMail(recipient, temppass){
  let transporter = nodemailer.createTransport({
      host: 'localhost',
      secure: false,
      port: 25,
      tls: {
              rejectUnauthorized: false
      }
  });

    // setup email data with unicode symbols
    let mailOptions = {
        from: 'PA History Finder <ubuntu@ec2-18-219-163-99.us-east-2.compute.amazonaws.com>', // sender address
        to: recipient, // list of receivers
        subject: 'Thank you for signing up ✔', // Subject line
        text: '${tempass} was assigned to me....', // plain text body
        html: '<b>Your temp password is '+tempass+'. Use it to sign in and PLEASE change the password to one that you will remember :)</b>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });

  }
