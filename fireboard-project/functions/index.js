const functions = require('firebase-functions');
const admin = require('firebase-admin');
var serviceAccount = require("./fireboard-hackathon2017-firebase-adminsdk-6h6c7-5313aa5dfa.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fireboard-hackathon2017.firebaseio.com"
});

var database = admin.database();

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