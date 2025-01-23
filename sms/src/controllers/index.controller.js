const SMS = require("../models/sms");
const { sendMessage } = require("../twilio/send-sms");
const { MessagingResponse } = require("twilio").twiml;
const { getSocket } = require("../sockets");

// Controller to handle rendering the index page with sorted SMS messages
const indexController = async (req, res) => {
  // Fetch all SMS messages, sorted by creation date in descending order
  const messages = await SMS.find().sort("-createdAt").lean();
  // Render the 'index' view and pass the messages to it
  res.render("index", { messages });
};

// Controller to handle posting a new message
const postMessage = async (req, res) => {
  const { message, phone } = req.body;
  
  // Check if message or phone is missing in the request body
  if (!message || !phone) {
    return res.json("Missing message or phone");
  }

  // Send the message using the Twilio sendMessage function
  const sentMessage = await sendMessage(message, phone);
  console.log(sentMessage.sid);

  // Create a new SMS document in the database
  await SMS.create({
    Body: req.body.message,
    From: req.body.phone
  });

  // Redirect to the home page
  res.redirect("/");
};

// Controller to handle receiving a new message
const receiveMessage = async (req, res) => {
  const twiml = new MessagingResponse();
  console.log(req.body.Body);

  // Create a new SMS document in the database
  const newMessage = await SMS.create({
    Body: req.body.Body,
    From: req.body.From
  });

  // Emit the new message to connected sockets
  getSocket().emit("new message", newMessage);

  // Respond with the TwiML response
  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
};

// Export the controllers
module.exports = {
  indexController,
  postMessage,
  receiveMessage
};
