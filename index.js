//CONFIG
const cheerio = require('cheerio'),
  axios = require('axios'),
  url = 'https://www.drupal.org/security';

var nodemailer = require('nodemailer');

//MAIL CONFIGURATION

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'from_address_goes_here',
    pass: 'password_goes_here'
  }
});

var mailOptions = {
  from: 'from_addres_goes_here',
  to: 'to_addresss_goes_here',
  subject: 'A new security patch is available in Drupal core!',
  text: 'Check in https://www.drupal.org/security '
};

var minutes = 1, the_interval = minutes * 60 * 1000;


//MAIN
var intervalId = setInterval(function () {
  checkWebsite()
}, the_interval);


//AUX

function checkWebsite(){
  axios.get(url)
    .then((response) => {
      let $ = cheerio.load(response.data);
      let date = $('.view-content > .views-row.views-row-1 > .node > .content > .field-name-drupalorg-sa-date > .field-items > .field-item').text()
      let date_object = new Date(date);
      if (isToday(date_object)) {
        sendMail()
        clearInterval(intervalId);
        console.log('New security update found')
      } else {
        console.log('no new updates were found')
      }
    }).catch(function (e) {
      console.log(e);
    });
}

function sendMail(){
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

function isToday(date) {
  const today = new Date()
  return date.getDate() == today.getDate() &&
    date.getMonth() == today.getMonth() &&
    date.getFullYear() == today.getFullYear()
}
