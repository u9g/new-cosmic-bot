module.exports = ({
  bot,
  Discord,
  client,
  discordConfig,
  util,
  chalk,
  plugin,
}) => {
  const regex = {
    colorCodes: /\§./g,
    itemInBox: /[1-9]x/,
  };
  let itemShowing = false;

  bot.on("message", function (msg) {
    const channels = discordConfig.slotbotChannelId;
    const fullText = util.GenerateFullText(msg);

    if (fullText.includes("/slot Credit Shop has been restocked")) {
      itemShowing = true;
      util.SendExecutedByServer(chalk, plugin);
      //console.log("[creditShopRestock] Credit Shop has been restocked");
    } else if (itemShowing) {
      const restockItem = GetItem(fullText, regex);
      const embed = CreateEmbed(Discord, restockItem);
      SendMessage(channels, client, embed);
      itemShowing = false;
    }
  });
};
function CreateEmbed(Discord, restockItem) {
  return new Discord.MessageEmbed()
    .setColor("RED")
    .setTitle("`Slot Credit Shop Restock`")
    .setDescription(restockItem)
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

function GetItem(fullText, regex) {
  return fullText.replace(regex.colorCodes, "").trim().substring(2);
}
