module.exports = ({ bot, client, discordConfig, Discord }) => {
  const colorCodes = /\§./g;
  const channels = discordConfig.gemChannelId;

  bot.on("message", function (msg) {
    //basic setup
    if (IsNotEnchantGem(msg)) return;
    //get vars
    const gemType = GemType(msg);
    const ign = GetIgn(msg, colorCodes);
    const gemEnchs =
      msg["extra"][1]["hoverEvent"]["value"]["tag"]["gems"]["enchs"];
    const gemColor = ConvertGemRarityToColor(GetGemRarity(msg));
    //create message
    const embed = CreateEmbed(Discord, gemColor, ign, gemEnchs, gemType);
    //send discord message
    SendDiscordMessage(client, channels, embed, discordConfig);
  });
};

function CreateEmbed(Discord, gemColor, ign, gemEnchs, gemType) {
  const enchants = CreateEnchantString(gemEnchs);
  return new Discord.MessageEmbed()
    .setColor(gemColor)
    .setTitle("`" + ign + "`" + " has " + enchants)
    .setTimestamp()
    .setFooter(gemType + " gem", GetGemImage(gemType));
}
function CreateEnchantString(gemEnchs) {
  let enchants = "";
  Object.entries(gemEnchs).forEach((ench) => {
    const msg = ench[0] + " " + ench[1] + ", ";
    enchants += msg;
  });
  enchants = enchants.substring(0, enchants.length - 2);
  return enchants;
}

function GetGemImage(gemType) {
  switch (gemType) {
    case "Diamond":
      return "https://i.imgur.com/8UuGmxx.png";
    case "Iron":
      return "https://i.imgur.com/g1NZDrm.png";

    case "Stone":
      return "https://i.imgur.com/bRR5k5h.png";

    case "Nether":
      return "https://i.imgur.com/HHKa6P7.png";

    default:
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Question_mark_%28black%29.svg/1280px-Question_mark_%28black%29.svg.png";
  }
}

function SendDiscordMessage(client, channels, embed, discordConfig) {
  client.channels.fetch(discordConfig.gemCheckChannelId).then((channel) => {
    channel.messages
      .fetch({ limit: 10 })
      .then((messages) => {
        let isDuplicate = false;
        messages.forEach((messg) => {
          if (isMsgSameAsOther(messg)) {
            isDuplicate = true;
          }
        });
        if (!isDuplicate) {
          sendMessagesToAllDiscs();
        }
      })
      .catch(console.error);
  });

  sendMessagesToAllDiscs();

  function isMsgSameAsOther(messg) {
    return (
      messg.embeds && messg.embeds[0] && messg.embeds[0].title === embed.title
    );
  }

  function sendMessagesToAllDiscs() {
    channels.forEach((id) => {
      sendEmbedToCurrDisc(id);
    });
  }

  function sendEmbedToCurrDisc(id) {
    client.channels.fetch(id).then((channel) => {
      channel.messages
        .fetch({ limit: 10 })
        .then((messages) => {
          let isDuplicate = false;
          messages.forEach((messg) => {
            if (
              messg.embeds &&
              messg.embeds[0] &&
              messg.embeds[0].title === embed.title
            ) {
              isDuplicate = true;
            }
          });
          if (!isDuplicate) {
            sendMsg(channel);
          }
        })
        .catch(console.error);
    });
  }

  function sendMsg(channel) {
    channel.send(embed);
  }
}

function GetIgn(msg, colorCodes) {
  const playerInfo = msg["hoverEvent"]["value"]["text"].replace(colorCodes, "");
  return playerInfo.substring(0, playerInfo.indexOf("'"));
}

function GemType(msg) {
  const gemTitle =
    msg["extra"][1]["hoverEvent"]["value"]["tag"]["display"]["Name"];

  let gemType = "";

  if (gemTitle.includes("Diamond")) {
    gemType = "Diamond";
  } else if (gemTitle.includes("Iron")) {
    gemType = "Iron";
  } else if (gemTitle.includes("Nether")) {
    gemType = "Nether";
  } else if (gemTitle.includes("Stone")) {
    gemType = "Stone";
  }
  return gemType;
}

function IsNotEnchantGem(msg) {
  return (
    !msg["extra"] ||
    !msg["extra"][1] ||
    !msg["extra"][1]["hoverEvent"] ||
    !msg["extra"][1]["hoverEvent"]["value"] ||
    !msg["extra"][1]["hoverEvent"]["value"]["tag"] ||
    !msg["extra"][1]["hoverEvent"]["value"]["tag"]["gems"] ||
    !msg["extra"][1]["hoverEvent"]["value"]["tag"]["gems"]["enchs"] ||
    !msg["hoverEvent"]
  );
}

function GetGemRarity(msg) {
  let colorToReturn;
  const gemIndex = {
    a: "uncommon",
    b: "elite",
    e: "rare",
    "6": "legendary",
    "5": "boss",
  };
  const gemRaritiesNum = ["uncommon", "elite", "rare", "legendary", "boss"];
  if (
    !msg.extra[1].hoverEvent.value.tag.display.Name.includes("Multi-Enchant")
  ) {
    const gemColor = msg.extra[1].hoverEvent.value.tag.display.Name.substring(
      msg.extra[1].hoverEvent.value.tag.display.Name.indexOf("(") + 2,
      msg.extra[1].hoverEvent.value.tag.display.Name.indexOf("(") + 3
    );
    colorToReturn = gemIndex[gemColor];
  } else {
    let biggestIndex = 0;
    GetMultiGemRawColors(msg).forEach((color) => {
      if (biggestIndex === 0) {
        biggestIndex = gemIndex[color];
      } else if (
        gemRaritiesNum[gemIndex[color]] > gemRaritiesNum[biggestIndex]
      ) {
        biggestIndex = gemIndex[color];
      }
      colorToReturn = biggestIndex;
    });
  }
  return colorToReturn;
}

function GetMultiGemRawColors(msg) {
  const enchs = [
    msg.extra[1].hoverEvent.value.tag.display.Lore[3],
    msg.extra[1].hoverEvent.value.tag.display.Lore[4],
  ];
  return [
    enchs[0].substring(enchs[0].indexOf("*") + 3, enchs[0].indexOf("*") + 4),
    enchs[1].substring(enchs[1].indexOf("*") + 3, enchs[1].indexOf("*") + 4),
  ];
}

function ConvertGemRarityToColor(rarity) {
  const colors = {
    uncommon: "GREEN",
    elite: "BLUE",
    rare: "GOLD",
    legendary: "ORANGE",
    boss: "DARK_PURPLE",
  };
  return colors[rarity];
}
