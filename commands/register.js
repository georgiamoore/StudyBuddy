//const index = require('../index');
const config = require('../config.json');


module.exports = {
    name: `register`,
    description: 'Register the active channel.',
    execute(message, args) {
        
        if (config.registeredChannel != null){
            config.registeredChannel.setTopic("");
        }
        config.registeredChannel = message.channel;
        config.registeredChannel.send(`Successfully registered to ${config.registeredChannel}!`);
        config.registeredChannel.setTopic("Study Buddy");
    },
  };