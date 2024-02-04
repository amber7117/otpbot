module.exports = async function(bot, chatId, ctx, db) {
    const embed = require('../embed'); // Adapted for Telegram
    const config = require('../config');

    if (!ctx.message || !ctx.message.text || ctx.message.text.split(' ')[0].toLowerCase() !== "/secret") {
        return false;
    }

    const args = ctx.message.text.split(' ').slice(1);
    if (args.length != 2) {
        return embed(bot, chatId, 'Need more arguments', 'You need to give 2 arguments, example: /secret yoursecretpass username');
    }

    const cmd = args[0].toLowerCase();
    if (cmd != config.secretpassword.toLowerCase()) {
        return embed(bot, chatId, 'Bad first argument', 'The first argument needs to be your secret password, example: /secret yoursecretpass username');
    }

    const username = args[1];
    try {
        const userRef = db.collection('users').doc(username);
        const doc = await userRef.get();

        if (!doc.exists) {
            // User does not exist, create new user
            const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
            await userRef.set({
                username: username,
                date: date,
                permissions: 0
            });
            embed(bot, chatId, 'User Added', '@' + username + ' has been added to the database as Admin.');
        } else {
            // User exists, check permissions
            const userData = doc.data();
            if (userData.permissions === 0) {
                embed(bot, chatId, 'Already Admin', '@' + username + ' is already an Admin.');
            } else {
                // Update user permissions
                await userRef.update({
                    permissions: 0
                });
                embed(bot, chatId, 'Upgrade Successful', '@' + username + ' is now an Admin.');
            }
        }
    } catch (err) {
        console.error(err);
        embed(bot, chatId, 'Error', 'An error occurred while accessing the database.');
    }
};
