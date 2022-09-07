var express = require('express');
var router = express.Router();

const multer = require('multer');
const path = require('path');
var nodemailer = require('nodemailer');

const responseMail = require('./responseMail');
const approvalMail = require('./approvalMail');

const TRANSPORTER = 'gmail';
const TRANSPORTER_EMAIL = 'eliran.natan.87@gmail.com';
const TRANSPORTER_PASS = 'zeteigabaryvppvo';

const transporter = nodemailer.createTransport({
  service: TRANSPORTER,
  auth: {
    user: TRANSPORTER_EMAIL,
    pass: TRANSPORTER_PASS
  }
});

const sendApprovalEmail = (info) => {

  var mailOptions = {
    from: TRANSPORTER_EMAIL,
    to: info.requesterEmail,
    subject: 'תוכנית שביטים - הודעה בדבר קבלה לתוכנית',
    html: approvalMail.generateApprovalMail(info)
  };

  return transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      return {
        success: false,
        error
      }
    } else {
      return {
        success: true
      }
    }
  })

}

const sendResponseEmail = (info) => {
  
  var mailOptions = {
    from: TRANSPORTER_EMAIL,
    to: info.requesterEmail,
    subject: 'תוכנית שביטים - בקשת ההרשמה נקלטה במערכת',
    html: responseMail.generateResponseMail(info)
  };
  
  return transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      return {
        success: false,
        error
      }
    } else {
      return {
        success: true
      }
    }
  })

}

async function sendRegistrationEmail (info, file) {
  
  var mailOptions = {
    from: TRANSPORTER_EMAIL,
    to: TRANSPORTER_EMAIL,
    subject: 'Registration request',
    text: `
      studentFirstName: ${info.studentFirstName}, 
      studentLastName: ${info.studentLastName},
      requesterFirstName: ${info.requesterFirstName},
      requesterLastName: ${info.requesterLastName},
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
  
  return await new Promise((resolve,reject)=>{
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        reject(error)
      } else {
        resolve(info)
      }
    });
  })
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json(["Tony","Lisa","Michael","Ginger","Food"]);
});

router.post('/open-registration-request', multer().any(), function(req, res) {
  //console.log(req.body.studentFirstName)
  //console.log(req.body.studentLastName)
  //console.log(req.body)
  //console.log(req.files)

  sendRegistrationEmail(req.body, req.files[0]).then(() => {
    res.status(200).json({
      success: true
    });
    sendResponseEmail(req.body);
    setTimeout(() => {
      sendApprovalEmail(req.body);
    }, 86400000)
  }, error => {
    res.status(500).json({
      success: false,
      error
    });
  })

});

module.exports = router;
