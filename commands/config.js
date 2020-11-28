const index = require('../index');
let prefix = index.prefix;
// let registeredChannel = index.registeredChannel;
let sessionTime = index.sessionTime;
const getYoutubeTitle = require('get-youtube-title');
let successVideoId = index.successVideoId;
let failureVideoId = index.failureVideoId;
let alertVideoId = index.alertVideoId;

module.exports = {
    name: `${prefix}config`,
    description: 'Edit the default settings.',
    execute(message, args) {
        let setting = args[0].toLowerCase();

        if (setting == "time") {
            if (args[1] == null) {
                message.reply("input error - please enter an integer parameter!");
            } else if (!isNaN(args[1])) {
                sessionTime = args[1];
                message.reply(`study length successfully changed to ${sessionTime} minutes!`)
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
                    successVideoId = args[1];
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
                    failureVideoId = args[1];
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
                    alertVideoId = args[1];
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