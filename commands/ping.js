const index = require('../index');
let prefix = index.prefix;
//don't ask me why I'm leaving this in, I don't know either
module.exports = {
    name: `${prefix}ping`,
    description: 'Ping!',
    execute(message, args) {
        message.channel.send('Pong!');
    },
  };