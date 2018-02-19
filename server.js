const Express = require('express');
const BodyParser = require('body-parser');
const NodeMailer = require('nodemailer');
const Assert = require('assert');
const Controller = require('./controllers/indexcontroller')
// Connection URL
const url = 'mongodb://localhost:27017';

var app = Express();
app.set('view engine', 'ejs');
app.use(BodyParser.json()); // for parsing application/json
app.use(BodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

/*---------------Page & Form Routing--------------------*/

app.get('/', (req,res)=>{
  Controller.HomePage(req,res);
});

app.post('/searchHistoryForMap', (req,res) =>{
  Controller.SearchHistoryForMap(req, res, url, req.body);
});

/*---------------Select2 Requests--------------------*/

app.post('/NameOfMarkerList', (req,res) =>{
    Controller.NameOfMarkerList(req, res, url, req.body.term);
});

app.post('/CountyList', (req,res) =>{
  Controller.CountyList(req, res, url, req.body.term);
});

app.post('/CategoryList', (req,res) =>{
  Controller.CategoryList(req, res, url, req.body.term);
});

app.post('/LocationDescriptionList', (req,res) =>{
  Controller.LocationDescriptionList(req, res, url, req.body.term);
});


/*---------------Starting the Server--------------------*/


app.listen(3000, () =>{ console.log("Server listening on port 3000 !")});


/*---------------SMTP Email Functions--------------------*/
let host = 'ec2-18-219-163-99.us-east-2.compute.amazonaws.com';

function sendMail(recipient, temppass){
  let transporter = NodeMailer.createTransport({
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
        text: temppass+' was assigned to me....', // plain text body
        html: '<b>Your temp password is '+temppass+'. Use it to sign in and PLEASE change the password to one that you will remember :)</b>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });

  }
