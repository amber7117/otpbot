const express = require("express");
const morgan = require("morgan");
const setup = require("./setup");
const config = require("./config");
const voice = require("./routes/voice");
const status = require("./routes/status");
const call = require("./routes/call");
const sms = require("./routes/sms");
const get = require("./routes/get");
const stream = require("./routes/stream");
const auth = require("./middleware/authentification");

// Run setup if it's not done
if (!config.setupdone) {
  setup();
}

// Create an Express app instance
const app = express();

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Logger middleware for HTTP requests
app.use(morgan("dev"));

// Route Definitions
app.post("/voice/:apipassword", auth, voice);
app.post("/status/:apipassword", auth, status);
app.post("/call", auth, call);
app.post("/sms", auth, sms);
app.post("/get", auth, get);
app.get("/stream/:service", stream);

// Error handling middleware for 404 errors
app.use(function (req, res, next) {
  res.status(404).json({
    error: "Not found, or bad request method."
  });
});

// Export the app module
module.exports = app;
