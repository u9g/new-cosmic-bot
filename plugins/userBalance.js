let balRequestChannel = "";
const regex = {
  userDoesntExist: /(\(\!\)\s+(\w+)\s+(\w+)\s+(\w+)\s+(\w+)\s+(\w+)\s+(\w+)\!)/,
};

module.exports = ({ client, bot, Discord, util, plugin, chalk, handler }) => {
  const prefix = plugin.cmd_name;

  client.on("message", (msg) => {
    if (
      msg.content.startsWith(prefix) &&
      msg.channel.id === util.getCmdChannel() &&
      msg.content !== ">baltop"
    ) {
      if (msg.author.bot) return;
      if (msg.content.trim().length === prefix.length) {
        util.SendExecuted(chalk, plugin, msg.author.username);
        const embed = CreateHelpEmbed(Discord, util);
        msg.channel.send(embed);
      } else if (balRequestChannel !== "") {
        util.SendExecuted(chalk, plugin, msg.author.username);
        util.SendAlreadyRunning(msg.channel, prefix, Discord);
      } else {
        const prom = new Promise(function (resolve, reject) {
          handler(msg, "bal", resolve, reject);
        });
        prom.then(
          () => {
            bot.chat("/bal " + msg.content.substring(5));
            balRequestChannel = msg.channel.id;
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
    console.log(fullText);
    if (balRequestChannel !== "" && fullText.includes("'s Balance")) {
      const info = {
        ign: fullText.substring(0, fullText.indexOf("'")),
        balance: fullText.substring(fullText.indexOf(":") + 3),
      };
      const embed = CreateEmbed(Discord, info, util);
      SendMessage(balRequestChannel, client, embed);
      balRequestChannel = "";
    } else if (
      balRequestChannel !== "" &&
      regex.userDoesntExist.test(fullText)
    ) {
      const embed = CreateNotMemberEmbed(util, Discord);
      SendMessage(balRequestChannel, client, embed);
      balRequestChannel = "";
    }
  });

  function CreateNotMemberEmbed(util, Discord) {
    return new Discord.MessageEmbed()
      .setColor(util.GenerateRandomEmbedColor())
      .setTitle("The user either doesn't exist or doesn't have a ballance.");
  }

  function SendMessage(channelId, client, embed) {
    client.channels
      .fetch(channelId)
      .then((channel) => {
        channel.send(embed);
      })
      .catch(console.error);
  }

  function CreateEmbed(Discord, info, util) {
    return new Discord.MessageEmbed()
      .setColor(util.GenerateRandomEmbedColor())
      .setTitle("`" + info.ign + "`" + " has $" + info.balance);
  }
  function CreateHelpEmbed(Discord, util) {
    return new Discord.MessageEmbed()
      .setColor(util.GenerateRandomEmbedColor())
      .setTitle(">bal [username]");
  }
};
