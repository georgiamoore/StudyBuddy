const Discord = require('discord.js');
const index = require('../index');
const ytdl = require('ytdl-core');
const getYoutubeTitle = require('get-youtube-title');
const config = require(__dirname + '/../config.json');


module.exports = {
    name: `start`,
    aliases: ['study', 's'],
    description: 'Start a study session.',
    usage: ['<study session length>', '<break length>'],
    execute(message, args) {
        sessionTime = config.sessionTime;
        breakLength = config.breakLength;
        let connection = null;
        if (args.length == 1) {
            if (!isNaN(args[0])) {
                sessionTime = args[0];
                validArgs(message, args);
            } else {
                message.reply("Invalid arguments! Please use integer parameters.")
            }
        } else if (args.length == 2) {
            if (!isNaN(args[0]) && !isNaN(args[1])) {
                sessionTime = args[0];
                breakLength = args[1];
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

async function joinVoiceChannel(message) {
    if (message.member.voice.channel) {
        connection = await message.member.voice.channel.join();
    }
}

function validArgs(message, args) {

    joinVoiceChannel(message);


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
                    message.channel.send(`OK! Your ${sessionTime} minute study session is starting now. Good luck!`);
                    waitForStudyTime(message, args);
                    sentMessage.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
                } else {
                    message.channel.send('Session cancelled. Please run !start for a new study session.');
                    if (typeof connection !== 'undefined') {
                        connection.disconnect();
                    }
                    sentMessage.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
                }
            }).catch(() => {
                message.reply('No reaction after 1 minute... Session cancelled.');
                if (typeof connection !== 'undefined') {
                    connection.disconnect();
                }
            });
    });


}

async function waitForStudyTime(message, args) {
    await sleep(sessionTime * 60000);
    message.reply(`${sessionTime} minutes have passed. Did you meet your goal?`).then(sentMessage => {
        if (typeof connection !== 'undefined') {
            connection.play(ytdl('https://www.youtube.com/watch?v=' + config.alertVideoId));
        }
        
        sentMessage.react("👍") // set up response reactions
        sentMessage.react("👎")

        // response snippet from https://maah.gitbooks.io/discord-bots/content/getting-started/awaiting-messages-and-reactions.html
        // thank you 💕

        // only consider reactions from user that started the study session
        sentMessage.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '👍' || reaction.emoji.name == '👎'),
            { max: 1, time: 60000 }).then(collected => {
                if (collected.first().emoji.name == '👍') {
                    message.channel.send('Congratulations!');
                    //play victory sound in voice channel
                    if (typeof connection !== 'undefined') {
                        connection.play(ytdl('https://www.youtube.com/watch?v=' + config.successVideoId));
                    }
                    
                    //congrats!!! you get a cat pic !!!!!!!!!!!!!
                    grabCatPic(message, args);
                    
                    // postSession(message, args); //or if you don't want a cat pic uncomment this
                    sentMessage.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
                } else {
                    message.channel.send('Oh no...');
                    if (typeof connection !== 'undefined') {
                        connection.play(ytdl('https://www.youtube.com/watch?v=' + config.failureVideoId));
                    }
                    postSession(message, args);
                    sentMessage.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
                }
            }).catch(() => {
                message.reply('No reaction after 1 minute... Are you still there? Session ended.');
                if (typeof connection !== 'undefined') {
                    connection.disconnect();
                }
                sentMessage.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
            });

    });


}

async function grabCatPic(message, args) {
    message.channel.send("You met your goal, so here's a cat pic!");
    const fetch = require('node-fetch');
    const { file } = await fetch('https://aws.random.cat/meow').then(response => response.json());
    console.log(file);
    const embed = new Discord.MessageEmbed().setImage(file);
    message.channel.send(embed);
    postSession(message, args);

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
                        if (typeof connection !== 'undefined') {
                            connection.disconnect();
                        }
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
                                    if (typeof connection !== 'undefined') {
                                        connection.disconnect();
                                    }
                                    sentMessage.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
                                }
                            }).catch(() => {
                                message.reply('No reaction after 1 minute... Session cancelled.');
                                if (typeof connection !== 'undefined') {
                                    connection.disconnect();
                                }
                                sentMessage.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
                            });
                    });

                }
            }).catch((err) => {
                message.channel.send('No reaction after 1 minute, please run !start for a new study session!');
                if (typeof connection !== 'undefined') {
                    connection.disconnect();
                }
                sentMessage.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
            });
    });
}

async function handleBreak(message, args) {
    message.channel.send(`OK! Your ${breakLength} minute break is starting now.`);
    await sleep(breakLength * 60000);
    message.channel.send('Break\'s over! Time to study. 😊');
    if (typeof connection !== 'undefined') {
        connection.play(ytdl('https://www.youtube.com/watch?v=' + config.alertVideoId));
    }
    
    try {
        index.client.commands.get('start').execute(message, args);
    } catch (error) {
        console.error(error);
        if (typeof connection !== 'undefined') {
            connection.disconnect();
        }
        message.reply('There was an error starting a new session!');
    }
}