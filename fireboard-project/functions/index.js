const functions = require('firebase-functions');
const admin = require('firebase-admin');
var serviceAccount = require("./fireboard-hackathon2017-firebase-adminsdk-6h6c7-5313aa5dfa.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fireboard-hackathon2017.firebaseio.com"
});

var database = admin.database();

const gcs = require('@google-cloud/storage')();
const nodemailer = require('nodemailer');
const gmailEmail = encodeURIComponent(functions.config().gmail.email);
const gmailPassword = encodeURIComponent(functions.config().gmail.password);
const mailTransport = nodemailer.createTransport(
    `smtps://${gmailEmail}:${gmailPassword}@smtp.gmail.com`);

const APP_NAME = 'Fireboards';

exports.getUIDByEmail = functions.https.onRequest((request, response) => { 

	response.header('Content-Type','application/json');
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Headers', 'Content-Type');

  var email = request.query.email;
  console.log("Email: " + email);

  admin.auth().getUserByEmail(email).then(function(userRecord) {
    // See the UserRecord reference doc for the contents of userRecord.
    console.log("Successfully fetched user data:", userRecord.toJSON());

	var ref = database.ref("admins/" + userRecord.uid);

    ref.update({
		email: email
	});

    response.status(200).end();
  })
  .catch(function(error) {
    console.log("Error fetching user data:", error);
    response.status(400).send("No such user");
  });
  
});

exports.sendWelcomeEmail = functions.auth.user().onCreate(event => {
  const user = event.data;
  const email = user.email;
  const displayName = user.displayName;

  return sendWelcomeEmail(email, displayName);
});

function sendWelcomeEmail(email, displayName) {
  const mailOptions = {
    from: `${APP_NAME} <noreply@firebase.com>`,
    to: email
  };

  mailOptions.subject = `Welcome to ${APP_NAME}!`;
  mailOptions.text = `Hey ${displayName || ''}! Welcome to ${APP_NAME}. Thank you for registering. As a new learner, please browse through our available training materials on the site.`;
  return mailTransport.sendMail(mailOptions).then(() => {
    console.log('A welcome email was sent to:', email);
  });
}

exports.pushAnnouncements = functions.database.ref('/announcements/{id}').onCreate(event => {
  const announcement = event.data.val();

  console.log("Sending an email notification for a new announcement...");

  var usersRef = admin.database().ref('/users');
  return usersRef.on('value', function(snap) {
    snap.forEach(function(snapshot) {
      usersRef.child(snapshot.key).on('value', function(s) {
        sendAnnouncementsEmail(s.child('email').val(), announcement.title, announcement.details);
      });
    });
    console.log("Email notifications have been sent to all users.");
  });
});

function sendAnnouncementsEmail(email, announcementTitle, announcementDetails) {
  const mailOptions = {
    from: `${APP_NAME} <noreply@firebase.com>`,
    to: email
  };

  mailOptions.subject = `New Announcement from ${APP_NAME}`;
  mailOptions.text = `${announcementTitle}: ${announcementDetails}`;
  return mailTransport.sendMail(mailOptions).then(() => {
    console.log('An email for the announcement was sent to:', email);
  });
}

// exports.emailCourseStatusChanges = functions.database.ref('/userCourses/{uid}/{courseId}').onWrite(event => {
//   const userCourse = event.data.val();
//   const userUid = event.params.uid;

//   console.log("Sending an email notification for user update status...");

//   var usersRef = admin.database().ref('/users');
//   return usersRef.on('value', function(snap) {
//     snap.forEach(function(snapshot) {
//         sendCourseStatusUpdateEmail(s.child('email').val(), userCourse.courseName, userCourse.status, userCourse.myRating);
//     });
//     console.log("Email notification has been sent to user: ", userUid);
//   });
// });

// function sendCourseStatusUpdateEmail(email, courseTitle, courseStatus, rating) {
//   const mailOptions = {
//     from: `${APP_NAME} <noreply@firebase.com>`,
//     to: email
//   };

//   mailOptions.subject = `Course Status Update on ${APP_NAME}`;
//   mailOptions.text = `${courseTitle}: ${courseStatus}. `;
//   return mailTransport.sendMail(mailOptions).then(() => {
//     console.log('An email for course status update was sent to:', email);
//   });
// }

exports.emailOnUpload = functions.storage.object().onChange(event => {
  const object = event.data;

  console.log("Sending an email notification for a new file upload...");

  var adminsRef = admin.database().ref('/admins');
  return adminsRef.on('value', function(snap) {
    snap.forEach(function(snapshot) {
      adminsRef.child(snapshot.key).on('value', function(s) {
        sendFileUploadEmail(s.child('email').val());
      });
    });
    console.log("Email notifications have been sent to all users.");
  });
});

function sendFileUploadEmail(email) {
  const mailOptions = {
    from: `${APP_NAME} <noreply@firebase.com>`,
    to: email
  };

  mailOptions.subject = `New File Upload to ${APP_NAME}`;
  mailOptions.text = `A new file was uploaded for a new course.`;
  return mailTransport.sendMail(mailOptions).then(() => {
    console.log('An email for the file upload was sent to:', email);
  });
}