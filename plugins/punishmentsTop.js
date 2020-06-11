const possibleArgs = ["ban", "mute", "warn", "kick"];

module.exports = ({ client, Discord, util, chalk, plugin, handler }) => {
  const prefix = plugin.cmd_name;
  client.on("message", (msg) => {
    if (
      prefix.some((v) => msg.content.toLowerCase().startsWith(v)) &&
      msg.channel.id === util.getCmdChannel()
    ) {
      const args = msg.content.split(" ");
      if (findCommonElements(args, prefix) && args.length === 1) {
        sendMessage(msg.channel.id, client, createHelpEmbed(Discord, util));
      } else if (findCommonElements(args, possibleArgs)) {
        util.SendExecuted(chalk, plugin, msg.author.username);
        const prom = new Promise(function (resolve, reject) {
          handler(msg, "puntop", resolve, reject);
        });
        prom.then(
          () => {
            const arg = args.splice(1);
            const arr = require(`./lbs/${arg[0]}Top.json`);
            const description = createDescription(arr, arg);
            sendMessage(
              msg.channel.id,
              client,
              createEmbed(Discord, description, arg[0], util)
            );
          },
          function (err) {
            //HANDLES IF THE COMMAND WAS STILL ON COOLDOWN
          }
        );
      } else {
        sendMessage(msg.channel.id, client, createHelpEmbed(Discord, util));
      }
    }
  });
};

function createDescription(arr, arg) {
  let description = "";
  for (let i = 0; i < 10; i++) {
    description += `${i + 1}. **${arr[i][0]} has ${arr[i][1]} ${arg[0]}(s)**\n`;
  }
  return description;
}

function sendMessage(channelId, client, embed) {
  client.channels
    .fetch(channelId)
    .then((channel) => {
      channel.send(embed);
    })
    .catch(console.error);
}

function findCommonElements(arr1, arr2) {
  return arr1.some((item) => arr2.includes(item.toLowerCase()));
}

function createHelpEmbed(Discord, util) {
  return new Discord.MessageEmbed()
    .setColor(util.GenerateRandomEmbedColor())
    .setTitle(">puntop [ban/mute/warn/kick]");
}

function createEmbed(Discord, description, type, util) {
  return new Discord.MessageEmbed()
    .setColor(util.GenerateRandomEmbedColor())
    .setTitle(">puntop " + type)
    .setDescription(description)
    .setFooter("Last updated 6/10/2020");
}
