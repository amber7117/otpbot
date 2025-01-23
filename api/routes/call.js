const express = require("express");
const bodyParser = require("body-parser");
const pino = require("express-pino-logger")();
const client = require("twilio")(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const app = express();

// 使用 body-parser 中间件解析请求体
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(pino);

// 定义一个 GET 路由，用于返回问候语
app.get("/api/greeting", (req, res) => {
  const name = req.query.name || "World";
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
});

// 定义一个 POST 路由，用于发送短信
app.post("/api/messages", (req, res) => {
  res.header("Content-Type", "application/json");

  // 使用 Twilio 客户端发送短信
  client.messages.create({
    from: process.env.TWILIO_PHONE_NUMBER,
    to: req.body.to,
    body: req.body.body,
  }).then(() => {
    res.send(JSON.stringify({ success: true }));
  }).catch(err => {
    console.error("Error sending message:", err);
    res.status(500).send(JSON.stringify({ success: false, error: err.message }));
  });
});

// 监听 3001 端口
app.listen(3001, () => console.log("Express server is running on localhost:3001"));
