const Discord = require('discord.js');
const client = new Discord.Client();

//Inicialization of bot's object
require('../.ini.js');

//setup of process variables
require('dotenv').config({
    path: `${drixnBot.paths.root}/.conf`
}) // read .conf and set environment variables to process.env

//Inicialization of main Bot's config
const config = require(`${drixnBot.paths.private}/config`);

client.on("ready", () => {
    // Bot Inicialization
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} servers.`);
    client.user.setPresence({
        game: {
            name: `twitch.tv/DrixnGG`,
            type: 'WATCHING'
        }
    });
    //Inicialization of emoji utility, saving all servers emoji into an object
    drixnBot.emojis = require(`${drixnBot.paths.utils}/emoji`)(client.emojis, config.emojis);
    //Inicialization of messages modules, saving all messages into an object
    drixnBot.messages = require(`${drixnBot.paths.utils}/messagesCompiler`)(drixnBot.paths.messages);
});


client.on("guildCreate", guild => {
    // Bot joined a server
    console.log(`New server joined: ${guild.name} (id: ${guild.id}). This server has ${guild.memberCount} members!`);
});

client.on("guildDelete", guild => {
    // Bot removed from a server
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
});

client.on('guildMemberAdd', member => {
    // User joined server
    const channel = member.guild.channels.find(ch => ch.name === process.env['SERVER_CHAT_NAME']);
    if (!channel) return;
    // Send message directly to the User
    const rulesChannel = member.guild.channels.find(ch => ch.name === process.env['RULES_CHAT_NAME']);
    if (!rulesChannel) return;
    member.send(drixnBot.messages[process.env['USER_WELCOME_MESSAGE_NAME']](member.user, rulesChannel));
    // Send the message to a designated channel on a server:
    channel.send(drixnBot.messages[process.env['CHANNEL_WELCOME_MESSAGE_NAME']](member.user));
});

client.on('raw', (event) => {
    const eventName = event.t;
    if (eventName === 'MESSAGE_REACTION_ADD' || eventName === 'MESSAGE_REACTION_REMOVE') {
        if (event.d.message_id === process.env['RULES_MESSAGE_ID'] || event.d.message_id === process.env['ROLE_ASSIGNING_MESSAGE_ID']) {
            var reactionChannel = client.channels.get(event.d.channel_id);
            if (reactionChannel.messages.has(event.d.message_id)) {
                return;
            } else {
                reactionChannel.fetchMessage(event.d.message_id)
                    .then(msg => {
                        var msgReaction = msg.reactions.get(`${event.d.emoji.name}:${event.d.emoji.id}`);
                        var user = client.users.get(event.d.user_id);
                        if (eventName === 'MESSAGE_REACTION_ADD') {
                            client.emit('messageReactionAdd', msgReaction, user);
                        } else if (eventName === 'MESSAGE_REACTION_REMOVE') {
                            client.emit('messageReactionRemove', msgReaction, user);
                        }
                    })
                    .catch(err => console.log('ERROR OCCURED WHILE REACTING:', err));
            }
        }
    }
});

client.on('messageReactionAdd', (messageReaction, user) => {
    var roleName = messageReaction.emoji.name;
    var role = messageReaction.message.guild.roles.find(role => role.name.toLowerCase() === roleName.toLowerCase());
    if (!role) return;
    var member = messageReaction.message.guild.members.find(member => member.id === user.id);
    if (!member) return;
    member.addRole(role.id);
});

client.on('messageReactionRemove', (messageReaction, user) =>{
    var roleName = messageReaction.emoji.name;
    var role = messageReaction.message.guild.roles.find(role => role.name.toLowerCase() === roleName.toLowerCase());
    if (!role) return;
    var member = messageReaction.message.guild.members.find(member => member.id === user.id);
    if (!member) return;
    member.removeRole(role.id);
});

client.on('message', msg => {
    // Ignore bot's messages
    if (msg.author.bot) return;
    // Ignores messages without our prefix
    if (msg.content.indexOf(config.prefix) !== 0) return;

    //Gets the actual command user wants to invoke
    const args = msg.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    switch (command) {
        default:
            console.log(`${msg.author} wanted to call unsupported command ${command}`);
            break;
    }
});

client.login(process.env['BOT_TOKEN']);
