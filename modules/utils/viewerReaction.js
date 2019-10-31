module.exports = async (client, channel)=>{
    var text = `**if you** ***UNDERSTAND*** **the** ***RULES*** **and** ***ACCEPT*** **them, click** ***ACCEPT EMOTE*** **to use this discord to its full potentional**`;
    var message = channel.messages.find(m => m.content === text);
    if(message) message.delete();
    let msg = await channel.send(text);
    await msg.react('639096098765537299');
};