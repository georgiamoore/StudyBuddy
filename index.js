

const Discord = require('discord.js');
const client = new Discord.Client();
const credentials = require('./credentials.js');

//let registeredChannel = null;
exports.registeredChannel = null;
//let prefix = '!';
exports.prefix = '!';
//let sessionTime = 45;
exports.sessionTime = 45; //study session length in mins

exports.successVideoId = 'PZ_7ipJ6Cx8'; //FF1 victory fanfare
exports.failureVideoId = 'CVH1ICPLfnk'; //Super Mario World game over
exports.alertVideoId = '8yGfQak-q9M'; //Metal Gear Solid alert (idk man I couldn't find anything to use)


client.commands = new Discord.Collection();
const clientCommands = require('./commands/commands');

Object.keys(clientCommands).map(key => {
    client.commands.set(clientCommands[key].name, clientCommands[key]);
});

client.once('ready', () => {
	console.info(`Logged in as ${client.user.tag}!`);
});


client.on('message', (message) => {
    if (message.author.bot) return;
    

    const args = message.content.split(/ +/);
    const command = args.shift().toLowerCase();
    console.info(`Called command: ${command}`);
  
    if (!client.commands.has(command)) return;
  
    try {
        client.commands.get(command).execute(message, args);
    } catch (error) {
      console.error(error);
      message.reply('there was an error trying to execute that command!');
    }

    // if (message.content.toLowerCase() == "ping"){
    //     message.channel.send("pong");
    // }

    // if (message.content == prefix + "register"){
    //     if (registeredChannel != null){
    //         registeredChannel.setTopic("");
    //     }
    //     registeredChannel = message.channel;
    //     registeredChannel.send(`Successfully registered to ${registeredChannel}!`);
    //     registeredChannel.setTopic("Study Buddy");
    // }
});

client.login(credentials.token);


