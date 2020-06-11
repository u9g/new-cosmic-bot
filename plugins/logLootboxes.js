module.exports = ({ client, bot, discordConfig, Discord, chalk, util }) => {
  const channels = discordConfig.lootboxChannelId;
  const regex = /[1-9]x/; //item in box
  let currentLootbox = {};
  let showingLootBox = false;

  bot.on("message", function (msg) {
    const fullText = util.GenerateFullText(msg);

    if (fullText.includes("opened a Lootbox")) {
      //ign
      const newStr = fullText.substring(4);
      currentLootbox.ign = newStr.substring(0, newStr.indexOf(" "));
      console.log(
        chalk.white("[") +
          chalk.blue("log_lootboxes") +
          chalk.white("]") +
          chalk.green(currentLootbox.ign) +
          chalk.gray(" has just opened a lootbox.")
      );
      //lootbox
      const newStr2 = fullText.substring(fullText.indexOf("Lootbox: ") + 9);
      currentLootbox.name = newStr2.substring(0, newStr2.indexOf("and")).trim();
      //get lootbox items
      showingLootBox = true;
    } else if (regex.test(fullText) && showingLootBox) {
      //if this is one of the items in the lootbox ^^
      if (!currentLootbox.items) currentLootbox.items = [];
      currentLootbox.items.push(fullText);
    } else if (!regex.test(fullText) && showingLootBox) {
      //if this is no longer one of the items in the lootbox
      showingLootBox = false; //mark that the chat is no longer showing the lootbox
      // make embed
      const embed = createEmbed(Discord, currentLootbox);
      sendMessage(channels, client, embed);
      //reset currentLootbox object
      currentLootbox = {};
    }
  });
};
function createEmbed(Discord, currentLootbox) {
  const dataStr = makeDescription(currentLootbox);
  return new Discord.MessageEmbed()
    .setColor("AQUA")
    .setTitle("`Lootbox: " + currentLootbox.name + "`")
    .setDescription(dataStr)
    .setTimestamp()
    .setFooter(
      `Opened by ${currentLootbox.ign}`,
      `https://minotar.net/avatar/${currentLootbox.ign}`
    );

  function makeDescription(currentLootbox) {
    let dataStr = "";
    currentLootbox.items.forEach((item) => (dataStr += item + "\n"));
    return dataStr;
  }
}

function sendMessage(channels, client, embed) {
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
