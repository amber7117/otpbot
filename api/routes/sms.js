module.exports = function (req, res) {
  // Import the sqlite3 module and enable verbose mode for detailed error messages.
  const sqlite3 = require("sqlite3").verbose();
  
  // Create a new database object pointing to the specified database file.
  const db = new sqlite3.Database("./db/data.db");
  
  // Import the configuration file.
  const config = require("../config");
  
  // Import the Twilio module and create a new client using accountSid and authToken from the config.
  const twilioClient = require("twilio")(config.accountSid, config.authToken);
  
  // Extract the required parameters from the request body.
  const to = req.body.to || null;
  const user = req.body.user || null;
  const service = req.body.service + "sms";
  
  // Check if all required parameters are provided.
  if (to == null || user == null || service == null) {
    res.status(200).json({
      error: "Please post all the informations needed."
    });
    return false;
  }
  
  // Check if the service is recognized in the configuration.
  if (config[service] === undefined) {
    res.status(200).json({
      error: "The service wasn't recognised."
    });
    return false;
  }
  
  // Validate the phone number format and ensure user and service are not null.
  if (to.match(/^\d{8,14}$/g) && !!user && !!service) {
    // Send the SMS using Twilio.
    twilioClient.messages.create({
      body: config[service],
      from: config.callerid,
      statusCallback: config.serverurl + "/status/" + config.apipassword,
      to: "+" + to
    }).then(message => {
      const smssid = message.sid;
      
      // Send the SMS ID in the response.
      res.status(200).json({
        smssid: smssid
      });
      
      // Insert the SMS details into the database.
      db.run("INSERT INTO sms (smssid, user, itsfrom, itsto, content, service, date) VALUES (?, ?, ?, ?, ?, ?, ?)", 
        [smssid, user, config.callerid, to, config[service], service, Date.now()], 
        err => {
          if (err) {
            return console.log(err.message);
          }
        }
      );
    }).catch(err => {
      // Handle any errors that occur during the SMS creation.
      console.error(err.message);
      res.status(500).json({
        error: "Failed to send SMS."
      });
    });
  } else {
    // If phone number, user, or service is invalid, send an error response.
    res.status(200).json({
      error: "Bad phone number or username or service."
    });
  }
};
