const regex = {
  dzChest: /\(\!\)\s(.+?(?=\shas))\shas\slooted\sthe\sDead\sChest\sinside\sthe\s\/deadzone\sSuper\sNether\sFortress\!/,
};
module.exports = ({ client, bot, discordConfig, Discord, chalk, util }) => {
  const channels = discordConfig.dzChestChannelId;
  bot.on("message", (msg) => {
    const fullText = msg.toString();
    if (regex.dzChest.test(fullText)) {
      const killer = getDeadzoneChestFinisher(fullText);
      const embed = createEmbed(Discord, killer, util);
      SendMessage(channels, client, embed);
      console.log(`${killer} finished dz chest.`);
    }
  });
};
function getDeadzoneChestFinisher(fullText) {
  let ign = "";
  fullText.replace(regex.dzChest, function (match, dz_chest_opener) {
    ign = dz_chest_opener;
  });
  return ign;
}

function createEmbed(Discord, killer, util) {
  const username = util.EscapeMarkdown(killer);
  return new Discord.MessageEmbed()
    .setAuthor("The Cosmic Sky Bot", "https://i.ibb.co/7WnrkH2/download.png")
    .setTitle(`:crossed_swords: ${username} has just emptied a Deadzone Chest.`)
    .setTimestamp();
}

function SendMessage(channels, client, embed) {
  channels.forEach((id) => {
    client.channels
      .fetch(id)
      .then((channel) => {
        channel.send(embed);
        //channel.send(dataStr)
      })
      .catch(console.error);
  });
}
