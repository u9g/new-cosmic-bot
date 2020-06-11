module.exports = ({
  client: client,
  bot: bot,
  Discord: Discord,
  util,
  plugin,
  chalk,
  handler,
}) => {
  const prefix = plugin.cmd_name;
  let requestChannel = "";
  let showingAllianceMembers = false;
  let data = {};
  let commandRunning = false;
  const regex = {
    allianceDoesntExist: /(\(\!\)\s+(\w+)\s+(\w+)\s+(\w+)\s+(\w+)\s+(\w+)\s+'(\w+)')/,
  };
  client.on("message", (msg) => {
    if (
      msg.content.startsWith(prefix) &&
      msg.channel.id === util.getCmdChannel()
    ) {
      if (msg.author.bot) return;
      if (requestChannel !== "") {
        util.SendAlreadyRunning(msg.channel, prefix, Discord);
      } else if (msg.content.trim().length === prefix.length) {
        msg.channel.send(createHelpEmbed(Discord, util));
      } else {
        util.SendExecuted(chalk, plugin, msg.author.username);
        const prom = new Promise(function (resolve, reject) {
          handler(msg, "abal", resolve, reject);
        });
        prom.then(
          () => {
            bot.chat("/a who " + msg.content.substring(prefix.length + 1));
            requestChannel = msg.channel.id;
            commandRunning = true;
          },
          function (err) {
            //HANDLES IF THE COMMAND WAS STILL ON COOLDOWN
          }
        );
      }
    }
  });
  bot.on("message", (msg) => {
    const fullText = util.GenerateFullText(msg);
    console.log(fullText);
    if (fullText.includes("----------- [ ")) {
      //alliance name shown in chat (1 msg b4 members names)
      data.name = getAllianceName(fullText);
      showingAllianceMembers = true;
      data.members = [];
    } else if (showingAllianceMembers && fullText.includes("Enemies: ")) {
      //members names done being shown in chat
      showingAllianceMembers = false;
      data.balances = {};
      sendWaitEmbed(Discord, data, requestChannel, client, util);
      requestAllBalances(data.members, bot);
    } else if (showingAllianceMembers) {
      //showing member's names in chat
      data.members = data.members.concat(fullText.split(", "));
    } else if (commandRunning && fullText.includes("'s Balance")) {
      //showing a person's balance in chat
      const info = compileBalance(fullText);
      data.balances[info.ign] = info.balance;
      if (Object.entries(data.balances).length === data.members.length) {
        //IF ALL BALANCES ARE GRABBED
        const embed = makeEmbed(Discord, data);
        sendMessage(requestChannel, client, embed);
        ({ requestChannel, commandRunning } = resetCommand(
          requestChannel,
          commandRunning
        ));
      }
    } else if (
      (commandRunning && regex.allianceDoesntExist.test(fullText)) ||
      (commandRunning && fullText === "Usage: /alliance info <alliance/player>")
    ) {
      //if not an alliance
      const embed = createNotAllianceEmbed(Discord, util);
      sendMessage(requestChannel, client, embed);
      ({ requestChannel, commandRunning } = resetCommand(
        requestChannel,
        commandRunning
      ));
    }
  });
};

function createNotAllianceEmbed(Discord, util) {
  return new Discord.MessageEmbed()
    .setColor(util.GenerateRandomEmbedColor())
    .setTitle(
      "Either the alliance requested doesn't exist or the user doesn't have an alliance."
    );
}

function resetCommand(requestChannel, commandRunning) {
  requestChannel = "";
  commandRunning = false;
  return { requestChannel, commandRunning };
}

function sendWaitEmbed(Discord, data, requestChannel, client, util) {
  const embed = createWaitEmbed(Discord, data.name, util);
  sendMessage(requestChannel, client, embed);
}

function sendMessage(channelId, client, embed) {
  client.channels
    .fetch(channelId)
    .then((channel) => {
      channel.send(embed);
    })
    .catch(/*do nothing*/);
}

function makeEmbed(Discord, data) {
  const name = data.name;
  const balances = Object.entries(data.balances);
  const description = createDescription(balances);

  return new Discord.MessageEmbed()
    .setTitle("**>a bal " + name + "**")
    .setDescription(description)
    .setTimestamp()
    .setColor("DARK_PURPLE");
}

function createDescription(balances) {
  let description = "";
  let counter = 1;
  const bals = sortBalancesArr(balances);
  bals.forEach((memberEntry) => {
    description +=
      `${counter}. ` +
      "`" +
      memberEntry[0] +
      "`" +
      ` has **$${numberWithCommas(memberEntry[1])}**\n`;
    counter++;
  });
  const total = createTotal(balances);
  description += `\n**Total**: **__$${numberWithCommas(total)}__**`;
  return description;
}

function sortBalancesArr(balances) {
  var sortable = [];
  for (const member of Object.entries(balances)) {
    let number = parseInt(removeCommas(member[1][1]));
    sortable.push([member[1][0], number]);
  }
  sortable.sort(function (a, b) {
    return a[1] - b[1];
  });
  return sortable.reverse();
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

function createTotal(balances) {
  let total = 0;
  balances.forEach(
    (memberEntry) => (total += parseInt(removeCommas(memberEntry[1])))
  );
  return total;
}

function removeCommas(x) {
  return x.replace(/,/g, "");
}

function getAllianceName(fullText) {
  return fullText.substring(
    fullText.indexOf("[") + 2,
    fullText.indexOf("]") - 1
  );
}

function requestAllBalances(users, bot) {
  for (const ix in users) {
    setTimeout(() => {
      bot.chat("/bal " + users[ix]);
    }, 75 * (ix + 1));
  }
}

function compileBalance(fullText) {
  return {
    ign: fullText.substring(0, fullText.indexOf("'")),
    balance: fullText.substring(fullText.indexOf(":") + 3),
  };
}

function createHelpEmbed(Discord, util) {
  return new Discord.MessageEmbed()
    .setColor(util.GenerateRandomEmbedColor())
    .setTitle(">a bal *[alliance name / player name]*");
}

function createWaitEmbed(Discord, allianceName, util) {
  return new Discord.MessageEmbed()
    .setColor(util.GenerateRandomEmbedColor())
    .setTitle(
      `Please wait while balances are checked for ${allianceName} (~ 10 seconds)`
    );
}
