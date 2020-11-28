const Discord = require('discord.js');
const client = new Discord.Client();
//const credentials = require('./credentials.js');
const config = require('./config.json');

exports.registeredChannel = null;
// exports.sessionTime = 45; //study session length in mins
// exports.successVideoId = 'PZ_7ipJ6Cx8'; //FF1 victory fanfare
// exports.failureVideoId = 'CVH1ICPLfnk'; //Super Mario World game over
// exports.alertVideoId = '8yGfQak-q9M'; //Metal Gear Solid alert (idk man I couldn't find anything to use)



client.commands = new Discord.Collection();

const clientCommands = require('./commands/commands');
let prefix = config.prefix;

Object.keys(clientCommands).map(key => {
    client.commands.set(clientCommands[key].name, clientCommands[key]);
});



client.once('ready', () => {
    console.info(`Logged in as ${client.user.tag}!`);
    exports.client = client;
});


client.on('message', (message) => {
    
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
  
    console.info(`Called command: ${commandName}`);
  
    if (!client.commands.has(commandName)) return;
  
    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    
    if (command.args && !args.length) {
    	let reply = `You didn't provide any arguments, ${message.author}!`;
        
        if (command.usage) {
           
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply);
    }
    
    try {
        command.execute(message, args);
    } catch (error) {
      console.error(error);
      message.reply('there was an error trying to execute that command!');
    }
});

client.login(config.token);


