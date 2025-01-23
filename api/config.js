const path = require('path');

module.exports = {
    setupdone: 'true',

    /**
     * Information about the Twilio account
     */
    accountSid: '',   // Add your Twilio Account SID
    authToken: '',    // Add your Twilio Auth Token
    callerid: '+',    // Add your Caller ID

    /**
     * Information about the API
     */
    apipassword: '',  // Add your API password
    serverurl: '',    // Add your server URL

    /**
     * Information about the Discord webhook
     */
    discordwebhook: '',  // Add your Discord webhook URL

    /**
     * Information about the Telegram webhook
     */
    telegramwebhook: '',  // Add your Telegram webhook URL

    /**
     * Port on which the Express server runs
     */
    port: process.env.PORT || 80,

    /**
     * Paths for storing audio files
     */
    audioFilePaths: {
        welcome: path.join(__dirname, 'audio', 'welcome.mp3'),
        error: path.join(__dirname, 'audio', 'error.mp3'),
        notification: path.join(__dirname, 'audio', 'notification.mp3'),
        // Add more audio files as needed
    },

    /**
     * Content of SMS based on requested services
     */
    paypalsms: 'pp test 123' // Customize SMS content as needed
};
