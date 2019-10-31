//Utils file for emoji handling, returns an object with names and emojis
module.exports = (emojis, list)=>{
    var resultObj = {}
    for(let i = 0; i < list.length; i++){
        resultObj[list[i]] = emojis.find(emoji => emoji.name === list[i]);
    }
    return resultObj;
}