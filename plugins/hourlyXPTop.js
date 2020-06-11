module.exports = ({
  bot,
  Discord,
  client,
  discordConfig,
  chalk,
  plugin,
  util,
}) => {
  const channels = discordConfig.intervalXpChannelId;
  const regex = {
    number: /([1-9]|10)\./,
    colorCodes: /\§./g,
  };
  let showingData = false;
  let isTop = [];

  bot.on("message", function (msg) {
    const fullText = util.GenerateFullText(msg);

    if (fullText.includes("Top 10 Hourly Island Exp")) {
      showingData = StartGatheringData(showingData, chalk, plugin, util);
    } else if (
      regex.number.test(fullText) &&
      showingData &&
      isTop.length !== 10
    ) {
      AddData(fullText, regex, isTop);
    } else if (!regex.number.test(fullText) && showingData) {
      const msgToSend = createMessage(isTop);
      const embed = CreateEmbed(msgToSend, Discord);
      SendMessage(channels, client, embed);
      showingData = false;
      isTop = [];
    }
  });
};

function CreateEmbed(msgToSend, Discord) {
  return new Discord.MessageEmbed()
    .setColor("AQUA")
    .setTitle("`Hourly XP Top`")
    .setDescription(msgToSend)
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

function createMessage(isTop) {
  let strToSend = "";
  isTop.forEach((user) => {
    const info = {
      number: user.substring(0, user.indexOf(".")),
      name: user.substring(user.indexOf(" ") + 1, user.indexOf("(") - 1),
      xp: user.substring(user.indexOf("(") + 1, user.indexOf("EXP") - 1),
    };
    const points = [40, 36, 32, 28, 24, 20, 16, 12, 8, 4];
    strToSend +=
      `${info.number}. ` +
      "`" +
      info.name +
      "`" +
      ` => ${info.xp} XP & ${points[info.number - 1]} Points\n`;
  });
  return strToSend;
}

function getTime() {
  return new Date(Date.now()).getHours() > 12
    ? new Date(Date.now()).getHours() === 24 ||
      new Date(Date.now()).getHours() === 0
      ? "12 am"
      : new Date(Date.now()).getHours() - 12 + " pm"
    : new Date(Date.now()).getHours() + " am";
}

function StartGatheringData(showingData, chalk, plugin, util) {
  util.SendExecutedByServer(chalk, plugin, util);
  showingData = true;
  return showingData;
}

function AddData(fullText, regex, isTop) {
  const txt = fullText.replace(regex.colorCodes, "").trim();
  isTop.push(txt);
}
