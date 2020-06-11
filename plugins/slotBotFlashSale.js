module.exports = ({ bot, Discord, client, discordConfig, chalk, util }) => {
  const regex = {
    colorCodes: /\§./g,
  };
  let info = {};
  let itemShowing = false;
  const channels = discordConfig.slotbotChannelId;

  bot.on("message", function (msg) {
    const fullText = util.GenerateFullText(msg);

    if (fullText.includes("won the /slot bot Flash Sale")) {
      itemShowing = true;
      info.ign = GetIgn(fullText);
      LogFlashSaleEvent(chalk, info.ign);
    } else if (itemShowing) {
      info.item = GetItem(fullText, regex);
      const embed = CreateEmbed(Discord, info.ign, info.item);
      SendMessage(channels, client, embed);
      info = {};
      itemShowing = false;
    }
  });
};

function LogFlashSaleEvent(chalk, ign) {
  console.log(
    chalk.white("[") +
      chalk.blue("log_lootboxes") +
      chalk.white("]") +
      chalk.green(currentLootbox.ign) +
      chalk.gray(" has just opened a lootbox.")
  );
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

function CreateEmbed(Discord, ign, item) {
  return new Discord.MessageEmbed()
    .setColor("RED")
    .setTitle("`" + ign + " won the slot bot flash sale" + "`")
    .setDescription(item)
    .setTimestamp()
    .setFooter(`Opened by ${ign}`, `https://minotar.net/avatar/${ign}`);
}

function GetIgn(fullText) {
  return fullText.substring(
    fullText.indexOf("***") + 4,
    fullText.indexOf("won") - 1
  );
}

function GetItem(fullText, regex) {
  let item = fullText.replace(regex.colorCodes, "");
  return item.substring(item.indexOf("Prize") + 7);
}
