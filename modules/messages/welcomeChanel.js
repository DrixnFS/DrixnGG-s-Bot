//Messages which go into General-Server-Chat after user has Joined the server
module.exports = (msg)=>{
    return `${drixnBot.emojis['drixnggWelcome1']}${drixnBot.emojis['drixnggWelcome2']} **to the server** ${msg.member}**!** ***Please, follow the instructions i sent you.***`;
}
