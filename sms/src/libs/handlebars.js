const express = require("express");
const bodyParser = require("body-parser");
const pino = require("express-pino-logger")();
const client = require("twilio")(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const app = express();
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(pino);
app.get("/api/greeting", (_0xec1397, _0x44a9e9) => {
  const _0x42348c = _0xec1397.query.name || "World";
  _0x44a9e9.setHeader("Content-Type", "application/json");
  _0x44a9e9.send(JSON.stringify({
    greeting: "Hello " + _0x42348c + "!"
  }));
});
app.post("/api/messages", (_0x50ddba, _0x28127a) => {
  _0x28127a.header("Content-Type", "application/json");
  client.messages.create({
    from: process.env.TWILIO_PHONE_NUMBER,
    to: _0x50ddba.body.to,
    body: _0x50ddba.body.body
  }).then(() => {
    _0x28127a.send(JSON.stringify({
      success: true
    }));
  }).catch(_0x191f71 => {
    console.log(_0x191f71);
    _0x28127a.send(JSON.stringify({
      success: false
    }));
  });
});
app.listen(3001, () => console.log("Express server is running on localhost:3001"));
