//left this in just in case I ever feel like procrastinating by playing ping pong
module.exports = {
    name: `ping`,
    description: 'Ping!',
    execute(message, args) {
        message.channel.send('Pong!');
    },
  };