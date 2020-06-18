const regex = {
  spawn: /\(.+?(?=#)\#1\)\s(.+?(?= has))\shas\sspawned\sat\s(-?[0-9]+)x\,\s(-?[0-9]+)y\,\s(-?[0-9]+)z\!/,
  killersBelow: /Top Damaging Adventurers:|Brave Adventurer:/,
  killed: /\(\!\)\s(.+?(?= has))\shas\sbeen\sdefeated\sby\sa\s.+?(?=!)\!/,
  killer: /\s[1-9]+\.\s(.+?(?=\s-))\s-\s\(([0-9]+\.?[0-9]+?)\%\sDMG\sDealt\)/,
};
module.exports = ({ client, bot, discordConfig, Discord, chalk, util }) => {
  const channels = discordConfig.bossesChannelId;
  let bossKilled = {};
  let bossKillerShowing = false;

  bot.on("message", (msg) => {
    const fullText = msg.toString();
    if (regex.spawn.test(fullText)) {
      const bossSpawned = getSpawnedBossInfo(fullText);
      const embed = createSpawnEmbed(Discord, bossSpawned);
      SendMessage(channels, client, embed);
    } else if (regex.killed.test(fullText)) {
      bossKilled.name = getBossKilled(fullText);
    } else if (regex.killersBelow.test(fullText)) {
      bossKillerShowing = true;
      bossKilled.killers = [];
    } else if (bossKillerShowing && regex.killer.test(fullText)) {
      const killer = getBossKillerInfo(fullText);
      bossKilled.killers.push(killer);
    } else if (
      bossKillerShowing &&
      !regex.killer.test(fullText) &&
      bossKilled.name
    ) {
      bossKillerShowing = false;
      const embed = createKillEmbed(Discord, bossKilled);
      SendMessage(channels, client, embed);
      bossKilled = {};
    }
  });
};
function getSpawnedBossInfo(fullText) {
  let boss = {};
  fullText.replace(regex.spawn, function (match, name, x, y, z) {
    boss = {
      name: name,
      x: x,
      y: y,
      z: z,
    };
  });
  return boss;
}
function getBossKillerInfo(fullText) {
  let killer = {};
  fullText.replace(regex.killer, function (match, name, percent) {
    killer = {
      name: name,
      percent: percent,
    };
  });
  return killer;
}
function getBossKilled(fullText) {
  let name = "";
  fullText.replace(regex.killed, function (match, _name) {
    name = _name;
  });
  return name;
}

function createSpawnEmbed(Discord, bossInfo) {
  return new Discord.MessageEmbed()
    .setAuthor("The Cosmic Sky Bot", "https://i.ibb.co/7WnrkH2/download.png")
    .setTitle(
      `:crossed_swords: ${bossInfo.name} spawned at ${bossInfo.x}x, ${bossInfo.y}y, ${bossInfo.z}z`
    )
    .setTimestamp();
}

function createKillEmbed(Discord, killedBossInfo) {
  let desc = "";
  killedBossInfo.killers.forEach((killer, ix) => {
    desc += `${ix + 1}. **${killer.name}** (${killer.percent}%)\n`;
  });
  return new Discord.MessageEmbed()
    .setAuthor("The Cosmic Sky Bot", "https://i.ibb.co/7WnrkH2/download.png")
    .setTitle(
      `:skull_crossbones: ${killedBossInfo.name} has just been killed by:`
    )
    .setDescription(desc)
    .setTimestamp();
}

function SendMessage(channels, client, embed) {
  channels.forEach((id) => {
    client.channels
      .fetch(id)
      .then((channel) => {
        channel.send(embed);
        //channel.send(dataStr)
      })
      .catch(console.error);
  });
}
