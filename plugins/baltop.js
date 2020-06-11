module.exports = ({ client, bot, Discord, util, plugin, chalk, handler }) => {
  const prefix = plugin.cmd_name;
  let data = [];
  let requestChannel = "";
  const isIsTopEntry = RegExp(
    /((\d+)\.\s+(\w+)\:\s+\$([\-\+]{0,1}\d[\d\.\,]*[\.\,][\d\.\,]*\d+))/g
  );

  client.on("message", (msg) => {
    if (msg.content === ">baltop" && msg.channel.id === util.getCmdChannel()) {
      if (msg.author.bot) return;
      if (requestChannel !== "") {
        util.SendAlreadyRunning(msg.channel, prefix, Discord);
      } else {
        util.SendExecuted(chalk, plugin, msg.author.username);
        const prom = new Promise(function (resolve, reject) {
          handler(msg, "baltop", resolve, reject);
        });
        prom.then(
          () => {
            bot.chat("/baltop");
            data = [];
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
    //console.log(fullText);

    if (isIsTopEntry.test(fullText)) {
      // entry on /baltop
      data.push(fullText);

      if (data.length == 15) {
        // got all of baltop entries
        const embed = createEmbed(Discord, data, util);
        sendMessage(client, embed, requestChannel).catch(console.error);
        requestChannel = "";
      }
      if (isIsTopEntry.test(fullText)) {
        //needs to be here
      }
    }
  });
};

function sendMessage(client, embed, channelId) {
  return client.channels.fetch(channelId).then((channel) => {
    channel.send(embed);
  });
}

function createEmbed(Discord, data, util) {
  const desc = createDescription(data, util);
  return new Discord.MessageEmbed()
    .setTitle("**>baltop**")
    .setDescription(desc)
    .setColor(util.GenerateRandomEmbedColor())
    .setTimestamp();
}
function createDescription(data, util) {
  let dataStr = "";
  data.forEach((baltopEntry) => {
    const number = getNumber(baltopEntry);
    const ign = getIgn(util.EscapeMarkdown(baltopEntry));
    const bal = getBalance(baltopEntry);
    dataStr += `${number}. **${ign}**: $${bal}\n`;
    //dataStr += number + "`" + ign + "**" + bal + "\n";
  });
  return dataStr;

  function getBalance(baltopEntry) {
    return baltopEntry.substring(baltopEntry.indexOf(":") + 4);
  }

  function getNumber(baltopEntry) {
    const num = baltopEntry.substring(0, baltopEntry.indexOf(" ") + 1);
    return num.substring(0, num.length - 2);
  }

  function getIgn(baltopEntry) {
    return baltopEntry.substring(
      baltopEntry.indexOf(" ") + 1,
      baltopEntry.indexOf(":")
    );
  }
}
