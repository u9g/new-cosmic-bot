module.exports = ({ bot, client, Discord, discordConfig, util, chalk }) => {
  const channels = discordConfig.slotbotChannelId;
  let showingLootboxItems = false;
  let showingMetaSpinItem = false;
  const regex = /[1-9]x/; //item in box
  let ign;
  let currentRoll = {};

  bot.on("message", function (msg) {
    const fullText = util.GenerateFullText(msg);

    if (fullText.includes("rolled the slot /bot")) {
      currentRoll = {};
      currentRoll.ign = GetIgn(fullText, currentRoll);
      ign = GetIgn(fullText, currentRoll);
      showingLootboxItems = true;
    } else if (fullText.includes("Meta Spin")) {
      showingMetaSpinItem = true;
      LogMetaSpinEvent(ign, chalk);
    } else if (regex.test(fullText) && showingLootboxItems) {
      if (!currentRoll.items) currentRoll.items = [];
      currentRoll.items.push(fullText.trim().substring(2));
    } else if (!regex.test(fullText) && showingLootboxItems) {
      const embed = CreateSlotRollEmbed(Discord, currentRoll);
      LogSlotRollEvent(currentRoll, chalk);
      SendMessage(channels, client, embed);
      showingLootboxItems = false;
    } else if (showingMetaSpinItem) {
      const metaSpinItem = GetMetaSpinItem(fullText, regex);
      const embed = CreateMetaSpinEmbed(Discord, metaSpinItem, ign);
      SendMessage(channels, client, embed);
      showingMetaSpinItem = false;
    }
  });
};

function CreateMetaSpinEmbed(Discord, metaSpinItem, ign) {
  return new Discord.MessageEmbed()
    .setColor("AQUA")
    .setTitle("`Meta Spin`")
    .setDescription(metaSpinItem)
    .setTimestamp()
    .setFooter(`Opened by ${ign}`, `https://minotar.net/avatar/${ign}`);
}

function GetMetaSpinItem(fullText, regex) {
  return fullText.replace(regex.colorCodes, "").trim().substring(2);
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

function LogSlotRollEvent(currentRoll, chalk) {
  const { ign } = currentRoll;
  const len = currentRoll.items.length;
  console.log(
    chalk.white("[") +
      chalk.blue("log_slotbot") +
      chalk.white("] ") +
      chalk.green(ign) +
      chalk.gray(" has just rolled ") +
      chalk.green(len) +
      chalk.gray(" tickets.")
  );
}

function LogMetaSpinEvent(ign, chalk) {
  console.log(
    chalk.white("[") +
      chalk.blue("slotbot_meta_spin") +
      chalk.white("]") +
      chalk.green(ign) +
      chalk.gray(" has just rolled a meta spin.")
  );
}

function CreateSlotRollEmbed(Discord, currentRoll) {
  let dataStr = "";
  currentRoll.items.forEach((item) => (dataStr += item + "\n"));
  return new Discord.MessageEmbed()
    .setColor("AQUA")
    .setTitle("`" + currentRoll.items.length + " tickets`")
    .setDescription(dataStr)
    .setTimestamp()
    .setFooter(
      `Opened by ${currentRoll.ign}`,
      `https://minotar.net/avatar/${currentRoll.ign}`
    );
}

function GetIgn(fullText) {
  let newStr = fullText.trim();
  return newStr.substring(0, newStr.indexOf("rolled ") - 1);
}
