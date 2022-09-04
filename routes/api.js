var express = require('express');
var router = express.Router();

const multer = require('multer');
const path = require('path');
var nodemailer = require('nodemailer');

const TRANSPORTER = 'gmail';
const TRANSPORTER_EMAIL = 'eliran.natan.87@gmail.com';
const TRANSPORTER_PASS = 'zeteigabaryvppvo';

const sendResponseEmail = (info) => {

  var transporter = nodemailer.createTransport({
    service: TRANSPORTER,
    auth: {
      user: TRANSPORTER_EMAIL,
      pass: TRANSPORTER_PASS
    }
  });
  
  var mailOptions = {
    from: TRANSPORTER_EMAIL,
    to: info.requesterEmail,
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

}

const sendRegistrationEmail = (info, file) => {

  var transporter = nodemailer.createTransport({
    service: TRANSPORTER,
    auth: {
      user: TRANSPORTER_EMAIL,
      pass: TRANSPORTER_PASS
    }
  });
  
  var mailOptions = {
    from: TRANSPORTER_EMAIL,
    to: TRANSPORTER_EMAIL,
    subject: 'Registration request',
    text: `
      studentFirstName: ${info.studentFirstName}, 
      studentLastName: ${info.studentLastName},
      studentClass: ${info.studentClass},
      requesterFirstName: ${info.requesterFirstName},
      requesterLastName: ${info.requesterLastName},
      requesterRelation: ${info.requesterRelation},
      requesterPhoneNumber: ${info.requesterPhoneNumber},
      requesterEmail: ${info.requesterEmail},    
    `,
    attachments: [
      {
        filename: file.originalname,
        content: new Buffer.from(file.buffer)
      }
    ]
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json(["Tony","Lisa","Michael","Ginger","Food"]);
});

router.post('/open-registration-request', multer().any(), function(req, res, next) {
  console.log(req.body.studentFirstName)
  console.log(req.body.studentLastName)
  console.log(req.body)
  console.log(req.files)
  sendResponseEmail(req.body)
  sendRegistrationEmail(req.body, req.files[0])
});

module.exports = router;
