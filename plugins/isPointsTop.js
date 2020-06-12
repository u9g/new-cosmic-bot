let showingPeople = false;
let counter = 0;
let info = [];
let requestChannel = "";

module.exports = ({ client, bot, util, plugin, chalk, Discord, handler }) => {
  client.on("message", function (msg) {
    const prefix = plugin.cmd_name;
    if (msg.content === prefix) {
      if (requestChannel !== "") {
        util.SendAlreadyRunning(msg.channel, prefix, Discord);
      } else {
        util.SendExecuted(chalk, plugin, msg.author.username);
        const prom = new Promise(function (resolve, reject) {
          handler(msg, "ispointstop", resolve, reject);
        });
        prom.then(
          () => {
            requestAllIsTops(5, bot);
            requestChannel = msg.channel.id;
          },
          function (err) {
            //HANDLES IF THE COMMAND WAS STILL ON COOLDOWN
          }
        );
      }
    }
  });
  bot.on("message", function (msg) {
    const fullText = util.GenerateFullText(msg);
    if (fullText.includes("Top Player Islands")) {
      showingPeople = true;
    } else if (showingPeople) {
      const ign = getIgn(fullText);
      const points = getIslandPoints(msg);
      info.push([ign, points]);
      counter++;
    }
    if (counter === 15) {
      showingPeople = false;
      counter = 0;
    }
    if (info.length === 75) {
      const sorted = sortArr(info);
      const embed = createEmbed(Discord, sorted, util);
      sendMessage(client, embed, requestChannel);
      requestChannel = "";
      info = [];
    }
  });
};

function sendMessage(client, embed, channelId) {
  return client.channels.fetch(channelId).then((channel) => {
    channel.send(embed);
  });
}

function createEmbed(Discord, info, util) {
  const desc = createDescription(info, util);
  return new Discord.MessageEmbed()
    .setTitle("**>is points top**")
    .setDescription(desc)
    .setColor(util.GenerateRandomEmbedColor())
    .setTimestamp();
}

function createDescription(info, util) {
  let desc = "";
  for (let i = 0; i < 10; i++) {
    const ign = util.EscapeMarkdown(info[i][0]);
    const points = info[i][1];
    desc += `${i + 1}. **${ign}**: ${points}\n`;
  }
  return desc;
}

function sortArr(info) {
  let sort = info;
  sort.sort(
    (a, b) => parseInt(removeCommas(a[1])) - parseInt(removeCommas(b[1]))
  );
  return sort.reverse();
}

function removeCommas(x) {
  return x.replace(/,/g, "");
}

function getIslandPoints(msg) {
  let value = msg.extra[0].hoverEvent.value.text;
  value = value.substring(value.indexOf("Island Points"));
  value = value.substring(value.indexOf("§b") + 2, value.indexOf("\n"));
  return value;
}

function requestAllIsTops(count, bot) {
  for (let i = 1; i <= count; i++) {
    setTimeout(() => {
      bot.chat("/is top " + i);
    }, 100 * i);
  }
}

function getIgn(fullText) {
  let ign = fullText
    .substring(0, fullText.indexOf("("))
    .substring(0, fullText.lastIndexOf(" "))
    .trim();
  ign = ign.substring(ign.lastIndexOf(" ")).trim();
  return ign;
}
