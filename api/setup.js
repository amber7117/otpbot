const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const generatePassword = require("generate-password");

module.exports = function (req, res) {
  const db = new sqlite3.Database("./db/data.db");

  db.serialize(function () {
    db.run("CREATE TABLE IF NOT EXISTS calls (itsfrom TEXT, itsto TEXT, digits TEXT, callSid TEXT, status TEXT, date TEXT, user TEXT, name TEXT, service TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS sms (itsfrom TEXT, itsto TEXT, smssid TEXT, content TEXT, status TEXT, date TEXT, user TEXT, service TEXT)");
  });

  fs.readFile("config.js", "utf-8", function (err, data) {
    if (err) {
      throw err;
    }

    const newPassword = generatePassword.generate({
      length: 32,
      numbers: true
    });

    const updatedConfig = data.replace(/passwordtochange/gim, newPassword);

    fs.writeFile("config.js", updatedConfig, "utf-8", function (err) {
      if (err) {
        throw err;
      }

      console.log("Setup the new API password: done.");

      fs.readFile("config.js", "utf-8", function (err, data) {
        if (err) {
          throw err;
        }

        const finalConfig = data.replace(/false/gim, "true");

        fs.writeFile("config.js", finalConfig, "utf-8", function (err) {
          if (err) {
            throw err;
          }

          console.log("Automatic setup: done.");
        });
      });
    });
  });
};
