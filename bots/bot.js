const { Telegraf } = require('telegraf');
const config = require('./config');
const commandArgsMiddleware = require('./middleware/middleware');


const usercmd = require('./commands/user'); // 导入用户命令处理模块
const call = require('./commands/call');
const secret = require('./commands/secret');
const help = require('./commands/help');

// Your bot token
const bot = new Telegraf(config.botToken);

const admins = ['1575145017', '1575145017'];
const prefix = config.telegramprefix;
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = config.db;
exports.bot = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

// Example Firestore trigger
exports.onUserDataChange = functions.firestore
    .document('users/{userId}')
    .onUpdate((change, context) => {
        // perform actions here when a document in the 'users' collection is updated
        const newValue = change.after.data();
        const previousValue = change.before.data();
        
        console.log(`Data updated from ${JSON.stringify(previousValue)} to ${JSON.stringify(newValue)}`);
        
        // Continue with more logic here...

        return null; // or return a promise when async operations are done
    });

// Example Firebase Authentication trigger
exports.onUserCreate = functions.auth.user().onCreate((user) => {
    // perform actions here when a new user is created in Firebase Authentication
    console.log(`New user created: ${user.email}`);

    // Continue with more logic here...

    return null; // or return a promise when async operations are done
});
bot.use(commandArgsMiddleware());

// Command handlers
bot.command('user', ctx => usercmd(ctx, db));
bot.command('call', ctx => call(ctx, db));
bot.command('calltest', ctx => call(ctx, db));
bot.command('secret', (ctx) => {
    const chatId = ctx.chat.id;
    secret(bot, chatId, ctx, db);
});

bot.command('help', ctx => {
    const chatId = ctx.chat.id;
    const user = "@" + ctx.from.username;
    help(bot, chatId, user);
});

bot.on("text", async (ctx) => {
    if (ctx.message.from.bot) return;
    if (!ctx.message.text.startsWith(prefix)) return;

    const commandBody = ctx.message.text.slice(prefix.length).toLowerCase();
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

    const userRef = db.collection('users').doc(ctx.from.id.toString());
    try {
        const doc = await userRef.get();
        if (!doc.exists) {
            console.log('No such user!');
        } else {
            const userData = doc.data();
            const perms = userData ? userData.permissions : null;
            const ADMIN_CMD = ['user', 'calltest'];
            const USER_CMD = ['call', 'secret', 'help'];

            if (!ADMIN_CMD.includes(command) && !USER_CMD.includes(command)) {
                ctx.reply("This command doesn't exist. Please ask help to an admin.");
            } else if (perms != 'ADMIN' && ADMIN_CMD.includes(command)) {
                ctx.reply("You don't have the permissions to use this command.");
            } else {
                // Add your command logic here
                // e.g., if (command === 'user') { /* Your logic */ }
            }
        }
    } catch (error) {
        console.log('Error getting document', error);
    }
});

bot.launch();