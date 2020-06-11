module.exports = (client, plugins, Discord, util) => {
  client.on("message", (msg) => {
    if (msg.content === ">help" && msg.channel.id === util.getCmdChannel()) {
      const description = createDescription(plugins);
      const embed = createEmbed(Discord, description, util);
      msg.channel.send(embed);
    }
  });
};
function createDescription(plugins) {
  let description = "";
  for (const plugin of plugins) {
    if (plugin.cmd_name !== "") {
      if (typeof plugin.cmd_name !== "string") {
        description += `**__${plugin.cmd_name[0]}__**: *${plugin.description}*\n`;
      } else {
        description += `**__${plugin.cmd_name}__**: *${plugin.description}*\n`;
      }
    }
  }
  return description;
}

function createEmbed(Discord, description, util) {
  return new Discord.MessageEmbed()
    .setTitle("**Commands Menu**")
    .setDescription(description)
    .setColor(util.GenerateRandomEmbedColor())
    .setTimestamp()
    .setFooter("Bot made by U9G", "https://minotar.net/avatar/U9G");
}
