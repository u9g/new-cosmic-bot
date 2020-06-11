exports.mineflayerOptions = () => {
  const config = require("./login.json");
  const options = {
    host: config["server-ip"],
    port: 25565,
    username: config["username"],
    password: config["password"],
  };
  return options;
};

exports.getCmdChannel = () => {
  return require("./login.json")["cmd-channel"];
};

exports.discordToken = () => {
  return require("./login.json")["discord-token"];
};

exports.GenerateFullText = (msg) => {
  let fullText = "";
  if (msg["extra"]) {
    msg["extra"].forEach((element) => (fullText += element));
  }
  return fullText;
};

exports.GenerateRandomEmbedColor = () => {
  const colors = [
    "DEFAULT",
    "AQUA",
    "GREEN",
    "BLUE",
    "PURPLE",
    "GOLD",
    "ORANGE",
    "RED",
    "GREY",
    "DARKER_GREY",
    "NAVY",
    "DARK_AQUA",
    "DARK_GREEN",
    "DARK_BLUE",
    "DARK_PURPLE",
    "DARK_GOLD",
    "DARK_ORANGE",
    "DARK_RED",
    "DARK_GREY",
    "LIGHT_GREY",
    "DARK_NAVY",
    "LUMINOUS_VIVID_PINK",
    "DARK_VIVID_PINK",
  ];
  return colors[Math.floor(Math.random() * (colors.length + 1))];
};

exports.SendAlreadyRunning = (channel, prefix, Discord) => {
  const msg =
    prefix + " command already running! Wait a few moments and try again!";
  let embed = new Discord.MessageEmbed();
  embed.setTitle(msg);
  channel.send(embed);
};
exports.SendExecuted = (chalk, plugin, user) => {
  console.log(
    chalk.white("[") +
      chalk.blue(plugin.plugin_name) +
      chalk.white("]") +
      chalk.gray(" has been executed by " + user + ".")
  );
};
exports.SendExecutedByServer = (chalk, plugin) => {
  console.log(
    chalk.white("[") +
      chalk.blue(plugin.plugin_name) +
      chalk.white("]") +
      chalk.gray(" has been executed.")
  );
};
