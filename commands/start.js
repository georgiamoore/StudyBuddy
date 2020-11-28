const Discord = require('discord.js');
const index = require('../index');
const getYoutubeTitle = require('get-youtube-title');
//const { timeEnd } = require('console');
const config = require('../config.json');


module.exports = {
    name: `start`,
    aliases: ['study', 's'],
    description: 'Start a study session.',
    usage: ['<study session length>', '<break length>'],
    execute(message, args) {
        sessionTime = config.sessionTime;
        breakLength = config.breakLength;
        console.log(args.length);
        // index.client.on('message', async message => {
        //     // Join the same voice channel of the author of the message
        //     if (message.member.voice.channel) {
        //         const connection = await message.member.voice.channel.join();
        //     }
        // });
        if (args.length == 1) {
            //TODO check if valid number
            if (!isNaN(args[0])) {
                sessionTime = args[0];
                validArgs(message, args);
            } else {
                message.reply("Invalid arguments! Please use integer parameters.")
            }
        } else if (args.length == 2) {
            //TODO check if valid number
            if (!isNaN(args[0]) && !isNaN(args[1])) {
                sessionTime = args[0];
                breakLength = args[1];
                console.log('breaklength'+breakLength);
                validArgs(message, args);
            } else {
                message.reply("Invalid arguments! Please use integer parameters.")
            }
        } else if (args.length > 2) {
            message.reply("That was too many arguments! \nThe proper usage would be: \`${prefix} ${command.name} ${command.usage}\ ");
        } else {
            validArgs(message, args);
        }

    },
};

function validArgs(message, args) {

    let initEmbed = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Study Buddy')
    .setDescription('Current settings')
    .addFields(
        { name: 'Study session length', value: sessionTime },
        { name: 'Break length', value: breakLength },
    )
    .setTimestamp();

    message.channel.send(initEmbed);
    message.channel.send(`Do you still want to start a study session?`).then(sentMessage => {
        sentMessage.react("👍")
        sentMessage.react("👎")


        sentMessage.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '👍' || reaction.emoji.name == '👎'),
            { max: 1, time: 60000 }).then(collected => {
                if (collected.first().emoji.name == '👍') {
                    message.channel.send(`OK! Your ${sessionTime} study session is starting now. Good luck!`);
                    waitForStudyTime(message, args);
                    sentMessage.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
                } else {
                    message.channel.send('Session cancelled. Please run !start for a new study session.');
                    sentMessage.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
                }
            }).catch(() => {
                message.reply('No reaction after 1 minute... Session cancelled.');
            });
    });


}

async function waitForStudyTime(message, args) {
    await sleep(5000); //TODO remove this is for testing only
    //await sleep(sessionTime * 60000);
    message.reply(`${sessionTime} minutes have passed. Did you meet your goal?`).then(sentMessage => {
        sentMessage.react("👍") // set up response reactions
        sentMessage.react("👎")

        // response snippet from https://maah.gitbooks.io/discord-bots/content/getting-started/awaiting-messages-and-reactions.html
        // thank you 💕

        // filter to user who initiated session exclusively
        sentMessage.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '👍' || reaction.emoji.name == '👎'),
            { max: 1, time: 60000 }).then(collected => {
                if (collected.first().emoji.name == '👍') {
                    message.channel.send('Congratulations!');
                    //play victory sound in voice channel
                    //client.destroy();
                    postSession(message, args);
                    sentMessage.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
                } else {
                    message.channel.send('Oh no...');
                    postSession(message, args);
                    sentMessage.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
                }
            }).catch(() => {
                message.reply('No reaction after 1 minute... Are you still there? Session ended.');
                sentMessage.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
            });

    });


}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function postSession(message, args) {
    message.channel.send(`Would you like to start another session?`).then(sentMessage => {
        sentMessage.react("👍") // set up response reactions
        sentMessage.react("👎")



        // filter to user who initiated session exclusively
        sentMessage.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '👍' || reaction.emoji.name == '👎'),
            { max: 1, time: 60000 }).then(collected => {
                if (collected.first().emoji.name == '👍') {
                    message.channel.send('Great! Starting a new session now...');
                    sentMessage.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));

                    try {

                        index.client.commands.get('start').execute(message, args);
                    } catch (error) {
                        console.error(error);
                        message.reply('There was an error starting a new session!');
                    }

                    //this.execute(message, args);
                } else {
                    sentMessage.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
                    message.channel.send('Would you like a break or are you finished studying? React 👍 for a break, 👎 to end the session.').then(sentMessage => {
                        sentMessage.react("👍") // set up response reactions
                        sentMessage.react("👎")
                    sentMessage.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '👍' || reaction.emoji.name == '👎'),
                        { max: 1, time: 60000 }).then(collected => {
                            if (collected.first().emoji.name == '👍') {
                                handleBreak(message, args);
                                sentMessage.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
                            } else {
                                message.channel.send('See you soon! (Please run !start for a new study session)');
                                sentMessage.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
                            }
                        }).catch(() => {
                            message.reply('No reaction after 1 minute... Session cancelled.');
                            sentMessage.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
                        });
                    });
                    
                }
            }).catch((err) => {
                message.channel.send('No reaction after 1 minute, please run !start for a new study session!');
                sentMessage.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
            });
    });
}

async function handleBreak(message, args){
    message.channel.send(`OK! Your ${breakLength} minute break is starting now.`);
    await sleep(breakLength * 60000);
    message.channel.send('Break\'s over! Time to study. 😊');
    try {
        index.client.commands.get('start').execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('There was an error starting a new session!');
    }
}