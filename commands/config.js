//const index = require('../index');
const config = require('../config.json');
const getYoutubeTitle = require('get-youtube-title');

const fs = require('fs');
const fileName = __dirname + '/../config.json';
const file = require(fileName);


module.exports = {
    name: `config`,
    description: 'Edit the default settings.',
    args: true,
    usage: '<command> <new setting>',
    execute(message, args) {

        if (!args.length) {
            return message.channel.send(`You didn't provide any arguments, ${message.author}!`);

        }

        let setting = args[0].toLowerCase();

        if (setting == "time") {
            if (args[1] == null) {
                message.reply("input error - please enter an integer parameter!");
            } else if (!isNaN(args[1])) {
                
                file.sessionTime = args[1];
                fs.writeFileSync(fileName, JSON.stringify(file, null, 2), function writeJSON(err) {
                    if (err) return console.log(err);
                   
                });
                message.reply(`study length successfully changed to ${sessionTime} minutes!`)
            } else {
                message.reply("input error - please enter an integer parameter!");
            }
        } else if (setting == "break") {
            if (args[1] == null) {
                message.reply("input error - please enter an integer parameter!");
            } else if (!isNaN(args[1])) {
                
                file.breakLength = args[1];
                fs.writeFileSync(fileName, JSON.stringify(file, null, 2), function writeJSON(err) {
                    if (err) return console.log(err);
                   
                });
                message.reply(`break length successfully changed to ${breakLength} minutes!`)
            } else {
                message.reply("input error - please enter an integer parameter!");
            }
        } else if (setting == "success") {
            //change goal success noise
            request.get('https://www.youtube.com/watch?v=' + args[1], function (error, response, body) {
                if (response.statusCode === 404) {
                    //video doesn't exist
                    message.reply("that video does not exist! Please enter a valid YouTube video ID.")
                }
                else {
                    //video found
                    getYoutubeTitle('args[1]', function (err, title) {
                        message.reply(`victory sound successfully changed to ${title}!`);
                    })
                    file.successVideoId = args[1];
                fs.writeFileSync(fileName, JSON.stringify(file, null, 2), function writeJSON(err) {
                    if (err) return console.log(err);
                   
                });
                   // config.successVideoId = args[1];
                }
            });
        } else if (setting == "failure") {
            //change goal failure noise
            request.get('https://www.youtube.com/watch?v=' + args[1], function (error, response, body) {
                if (response.statusCode === 404) {
                    //video doesn't exist
                    message.reply("that video does not exist! Please enter a valid YouTube video ID.")
                }
                else {
                    //video found
                    getYoutubeTitle('args[1]', function (err, title) {
                        message.reply(`victory sound successfully changed to ${title}!`);
                    })
                    file.failureVideoId = args[1];
                fs.writeFileSync(fileName, JSON.stringify(file, null, 2), function writeJSON(err) {
                    if (err) return console.log(err);
                   
                });
                    // config.failureVideoId = args[1];
                }
            });
        } else if (setting == "alert") {
            //change timer ending alert noise
            request.get('https://www.youtube.com/watch?v=' + args[1], function (error, response, body) {
                if (response.statusCode === 404) {
                    //video doesn't exist
                    message.reply("that video does not exist! Please enter a valid YouTube video ID.")
                }
                else {
                    //video found
                    getYoutubeTitle('args[1]', function (err, title) {
                        message.reply(`victory sound successfully changed to ${title}!`);
                    })
                    // config.alertVideoId = args[1];
                    file.alertVideoId = args[1];
                    fs.writeFileSync(fileName, JSON.stringify(file, null, 2), function writeJSON(err) {
                        if (err) return console.log(err);
                       
                    });
                }
            });
        } else {
            message.reply("invalid command, please enter a valid command.");
        }
        // if (registeredChannel != null){
        //     registeredChannel.setTopic("");
        // }
        // registeredChannel = message.channel;
        // registeredChannel.send(`Successfully registered to ${registeredChannel}!`);
        // registeredChannel.setTopic("Study Buddy");
    },

    // const params = args.content.split(/ +/);
    // const command = params.shift().toLowerCase();
};