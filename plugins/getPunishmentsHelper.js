const fetch = require("node-fetch");

exports.getPunishments = punishments;

async function punishments(username) {
  const url = "https://bans-api.cosmic.games/sky/player/" + username;

  const response = await fetch(url);
  const banInfo = await response.json();
  const punishments = generatePunishmentList(banInfo);

  return punishments;
}

function generatePunishmentList(banInfo) {
  let punishments = {};
  for (const info of banInfo) {
    if (!punishments[info.type]) {
      punishments[info.type] = 0;
    }
    punishments[info.type]++;
  }
  return punishments;
}
