// Load discord
const Discord = require("discord.js");
const client = new Discord.Client();
const util = require("./util.js");
const options = util.mineflayerOptions();
const discordConfig = require("./configs/discordConfig.json");
const plugins = require("./plugins.json");
const mineflayer = require("mineflayer");
const chalk = require("chalk");
const { handler } = require("./commands");

let bot = mineflayer.createBot(options);
bindEvents(bot);
startPlugins(plugins, bot);

function bindEvents(bot) {
  //for relogging
  bot.on("kicked", (reason) => {
    console.log(reason);
    bot.clear;
    setTimeout(relog, 300000); // If set less than 30s you will get an invalid credentials error
  });
}

function relog() {
  console.log("Attempting to reconnect...");
  bot = mineflayer.createBot(options);
  bindEvents(bot);
  startPlugins(plugins, bot);
}
function startPlugins(plugins, bot) {
  let pluginsArr = makePluginArr();
  //startHelpCommand();
  for (const plugin of pluginsArr) {
    if (plugin.enabled) {
      const requireList = {
        bot,
        client,
        Discord,
        discordConfig,
        util,
        chalk,
        plugin,
        handler,
      };
      require(plugin.path)(requireList);
      const pluginLoadedMsg =
        chalk.cyan("[Plugin Loader] ") +
        chalk.green(plugin.plugin_name) +
        chalk.white(" has been loaded.");
      console.log(chalk.cyan(pluginLoadedMsg));
    }
  }

  function startHelpCommand() {
    const pluginLoadedMsg =
      chalk.cyan("[Plugin Loader] ") +
      chalk.green("help_command") +
      chalk.white(" has been loaded.");
    console.log(pluginLoadedMsg);
    require("./plugins/helpCommand.js")(client, pluginsArr, Discord, util);
  }

  function makePluginArr() {
    let pluginsArr = Object.entries(plugins);
    pluginsArr = pluginsArr.map((x) => x[1]);
    return pluginsArr;
  }
}

client.login(util.discordToken());
