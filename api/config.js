const path = require('path');

module.exports = {
    setupdone: 'true',

    /**
     * Information about the Twilio account
     */
    accountSid: '',   // Add your Twilio Account SID
    authToken: '',    // Add your Twilio Auth Token
    callerid: '+1234567890',    // Add your Caller ID

    /**
     * Information about the API
     */
    apipassword: 'your_api_password',  // Add your API password
    serverurl: 'https://yourserverurl.com',    // Add your server URL

    /**
     * Information about the Telegram bot
     */
    telegramToken: 'YOUR_TELEGRAM_BOT_TOKEN',   // Add your Telegram bot token
    telegramChatId: 'YOUR_TELEGRAM_CHAT_ID',    // Add your Telegram chat ID

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
