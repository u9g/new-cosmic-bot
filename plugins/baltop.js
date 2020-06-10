module.exports = ({ client, bot, Discord, util, plugin, chalk, handler }) => {
  const prefix = plugin.cmd_name;
  let data = [];
  let requestChannel = "";
  const isIsTopEntry = RegExp(
    /((\d+)\.\s+(\w+)\:\s+\$([\-\+]{0,1}\d[\d\.\,]*[\.\,][\d\.\,]*\d+))/g
  );
  let prom;

  client.on("message", (msg) => {
    if (msg.content === ">baltop" && msg.channel.id === util.getCmdChannel()) {
      if (msg.author.bot) return;
      if (requestChannel !== "") {
        util.SendAlreadyRunning(msg.channel, prefix, Discord);
      } else {
        util.SendExecuted(chalk, plugin, msg.author.username);
        prom = new Promise(function (resolve, reject) {
          handler(msg, "baltop", resolve, reject);
        });
        prom.then(
          () => {
            ({ data, requestChannel } = startCommand(
              bot,
              data,
              requestChannel,
              msg
            ));
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

function startCommand(bot, data, requestChannel, msg) {
  bot.chat("/baltop");
  data = [];
  requestChannel = msg.channel.id;
  return { data, requestChannel };
}

function sendMessage(client, embed, channelId) {
  return client.channels.fetch(channelId).then((channel) => {
    channel.send(embed);
  });
}

function createEmbed(Discord, data, util) {
  const desc = createDescription(data);
  return new Discord.MessageEmbed()
    .setTitle("`>baltop`")
    .setDescription(desc)
    .setColor(util.GenerateRandomEmbedColor())
    .setTimestamp();
}
function createDescription(data) {
  let dataStr = "";
  data.forEach(
    (baltopEntry) =>
      (dataStr +=
        baltopEntry.substring(0, baltopEntry.indexOf(" ") + 1) +
        "`" +
        baltopEntry.substring(
          baltopEntry.indexOf(" ") + 1,
          baltopEntry.indexOf(":")
        ) +
        "`" +
        baltopEntry.substring(baltopEntry.indexOf(":")) +
        "\n")
  );
  return dataStr;
}
