// Import dependences
const mongoose = require('mongoose');
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');

// import schemas
const user = require('./userModel');

// Connect to Mongoose and set connection variable
mongoose.connect(`mongodb://${process.env.DBUSER}:${process.env.DBPASS}@ds247674.mlab.com:47674/sisa`, { useNewUrlParser: true });

var db = mongoose.connection;

// discord bot
// loads bot config
const config = JSON.parse(fs.readFileSync('bot_config.json'));

// runs when bot gets online
client.on('ready', () => {
  console.log(`¡${client.user.tag} acaba de nacer!`);
});

// commands
client.on('message', msg => {
  const message = msg.content.split(' ');
  const command = message[0][0] == config.prefix ? message[0].slice(1) : 'nonex';
  const commandPath = `./commands/${command}`;
  const arg = message.slice(1);

  // if a folder with the command name exists, run it
  fs.access(commandPath, fs.F_OK, err => {
    if (!err) {
      const cmdjs = require(commandPath);
      cmdjs(arg, msg);
    }
    return;
  })
});

// run bot
if (process.env.NODE_ENV !== 'development') {
  client.login(process.env.TOKEN);
} else {
  client.login(process.env.TOKENBOTDEV);  
}