const functions = require('firebase-functions');
const admin = require('firebase-admin');
var serviceAccount = require("./fireboard-hackathon2017-firebase-adminsdk-6h6c7-5313aa5dfa.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fireboard-hackathon2017.firebaseio.com"
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


exports.getUIDByEmail = functions.https.onRequest((request, response) => { 

	response.header('Content-Type','application/json');
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Headers', 'Content-Type');
    
  var email = request.query.email;
  console.log("Email: " + email);

  admin.auth().getUserByEmail(email).then(function(userRecord) {
    // See the UserRecord reference doc for the contents of userRecord.
    console.log("Successfully fetched user data:", userRecord.toJSON());

    response.status(200).send(userRecord.uid);
  })
  .catch(function(error) {
    console.log("Error fetching user data:", error);
    response.status(400).send("No such user");
  });
  
});