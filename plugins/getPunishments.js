const helper = require("./getPunishmentsHelper.js");
let requestChannel = "";
let ign = "";
module.exports = ({ client, Discord, util, plugin, chalk, handler }) => {
  const prefix = plugin.cmd_name;
  client.on("message", (msg) => {
    if (
      prefix.some((v) => msg.content.toLowerCase().startsWith(v)) &&
      !msg.author.bot &&
      msg.channel.id === util.getCmdChannel() &&
      !msg.content.startsWith(">puntop") &&
      !msg.content.startsWith(">punishmentstop")
    ) {
      if (requestChannel !== "") {
        util.SendAlreadyRunning(msg.channel, prefix, Discord);
      } else if (!prefix.some((v) => msg.content.trim().startsWith(v))) {
        msg.channel.send(createHelpEmbed(Discord, util));
      } else {
        util.SendExecuted(chalk, plugin, msg.author.username);
        const prom = new Promise(function (resolve, reject) {
          handler(msg, "puns", resolve, reject);
        });
        prom.then(
          () => {
            startCommand(msg, prefix, Discord, util);
          },
          function (err) {
            //HANDLES IF THE COMMAND WAS STILL ON COOLDOWN
          }
        );
      }
    }
  });
};

function startCommand(msg, prefix, Discord, util) {
  const ign = msg.content
    .substring(prefix.find((v) => msg.content.startsWith(v)).length)
    .trim();
  requestChannel = msg.channel.id;
  helper.getPunishments(ign).then((punishments) => {
    const description = makeDescription(punishments);
    const embed = createEmbed(Discord, description, ign, util);
    msg.channel.send(embed);
    requestChannel = "";
  });
}

function createHelpEmbed(Discord, util) {
  return new Discord.MessageEmbed()
    .setColor(util.GenerateRandomEmbedColor())
    .setTitle(">punishments *[player name]*");
}

function createEmbed(Discord, description, ign, util) {
  return new Discord.MessageEmbed()
    .setTitle("`" + ign + "`" + "'s punishments")
    .setColor(util.GenerateRandomEmbedColor())
    .setDescription(description)
    .setTimestamp();
}

function makeDescription(punishments) {
  let str = "";

  if (punishments["WARN"]) {
    str += "**- " + punishments["WARN"] + " warns**\n";
  } else if (!punishments["WARN"]) {
    str += "**- " + 0 + " warns**\n";
  }

  if (punishments["MUTE"]) {
    str += "**- " + punishments["MUTE"] + " mutes**\n";
  } else if (!punishments["MUTE"]) {
    str += "**- " + 0 + " mutes**\n";
  }

  if (punishments["BAN"]) {
    str += "**- " + punishments["BAN"] + " bans**\n";
  } else if (!punishments["BAN"]) {
    str += "**- " + 0 + " bans**\n";
  }

  if (punishments["KICK"]) {
    str += "**- " + punishments["KICK"] + " kicks**\n";
  } else if (!punishments["KICK"]) {
    str += "**- " + 0 + " kicks**\n";
  }

  return str;
}
