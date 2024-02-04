const admin = require('firebase-admin');
const config = require('../config');
const embed = require('../embed'); // Ensure this is adapted for Telegram's message format

module.exports = async function(ctx, db) {
    const chatId = ctx.from.id;
    const args = ctx.message.text.split(' ').slice(1);
    if (args.length != 2) {
        return embed(ctx, chatId, 'Need more arguments', 'You need to give 2 arguments, example: /user add username');
    }
    const cmd = args[0].toLowerCase();
    const username = args[1];
    const userid = ctx.from.id.toString();

    if (!['add', 'delete', 'info', 'setadmin'].includes(cmd)) {
        return embed(ctx, 'Bad first argument', 'The first argument needs to be add/delete/info/setadmin, example: /user add username');
    }

    const userRef = db.collection('users').doc(userid);

    try {
        const doc = await userRef.get();

        switch(cmd) {
            case 'add':
                if (doc.exists) {
                    return embed(ctx, 'Already User', 'This user is already in the database.');
                }
                await userRef.set({
                    username: username,
                    date: admin.firestore.FieldValue.serverTimestamp(),
                    permissions: 1
                });
                embed(ctx, 'User Added', 'User has been added to the database.');
                break;
            case 'delete':
                if (!doc.exists) {
                    return embed(ctx, 'User Not Found', 'This user is not in the database.');
                }
                await userRef.delete();
                embed(ctx, 'User Deleted', 'User has been deleted from the database.');
                break;
            case 'info':
                if (!doc.exists) {
                    return embed(ctx, 'User Not Found', `User with ID ${userid} is not in the database.`);
                }
                let userInfo = doc.data();
                let rank = userInfo.permissions === 0 ? 'admin' : 'a normal user';
                embed(ctx, 'User Information', `@${username} is ${rank}.`);
                break;
            case 'setadmin':
                if (!doc.exists) {
                    await userRef.set({
                        username: username,
                        date: admin.firestore.FieldValue.serverTimestamp(),
                        permissions: 0
                    });
                    embed(ctx, 'Admin Added', `@${username} has been added to the database as an admin.`);
                } else {
                    let userData = doc.data();
                    if (userData.permissions === 0) {
                        return embed(ctx, 'Already Admin', `@${username} is already an admin.`);
                    }
                    await userRef.update({ permissions: 0 });
                    embed(ctx, 'Admin Status Updated', `@${username} is now an admin.`);
                }
                break;
            default:
                embed(ctx, 'Invalid Command', 'This command is not recognized.');
                break;
        }
    } catch (error) {
        console.error(error);
        embed(ctx, 'Error', 'An error occurred while accessing the database.');
    }
};
