const index = require('../index');
let prefix = index.prefix;
let registeredChannel = index.registeredChannel;

module.exports = {
    name: `${prefix}register`,
    description: 'Register the active channel.',
    execute(message, args) {
        if (registeredChannel != null){
            registeredChannel.setTopic("");
        }
        registeredChannel = message.channel;
        registeredChannel.send(`Successfully registered to ${registeredChannel}!`);
        registeredChannel.setTopic("Study Buddy");
    },
  };