const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

// Example Firestore trigger
exports.onUserDataChange = functions.firestore
    .document('users/{userId}')
    .onUpdate((change, context) => {
        // perform actions here when a document in the 'users' collection is updated
        const newValue = change.after.data();
        const previousValue = change.before.data();
        
        console.log(`Data updated from ${JSON.stringify(previousValue)} to ${JSON.stringify(newValue)}`);
        
        // Continue with more logic here...

        return null; // or return a promise when async operations are done
    });

// Example Firebase Authentication trigger
exports.onUserCreate = functions.auth.user().onCreate((user) => {
    // perform actions here when a new user is created in Firebase Authentication
    console.log(`New user created: ${user.email}`);

    // Continue with more logic here...

    return null; // or return a promise when async operations are done
});