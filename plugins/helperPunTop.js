const got = require("got");
//const users = require("./lbs/users.json");
let users = ["u9g", "pv1", "pcebot"];
const { sorter } = require("./sortHelper.js");
let userData = [];

exports.start = main;

async function main(ign, ix) {
  const url = "https://bans-api.cosmic.games/sky/player/" + ign;
  try {
    const response = await got(url);
    const data = JSON.parse(response.body);
    const punishments = generatePunishmentList(data);
    userData.push([ign, punishments]);
  } catch (error) {
    console.log(error.response.body);
    //=> 'Internal server error ...'
  }
  if (users.length === ix + 1) {
    const warnTop = sorter("WARN", userData);
    const muteTop = sorter("MUTE", userData);
    const kickTop = sorter("KICK", userData);
    const banTop = sorter("BAN", userData);
    saveArr(warnTop, "warnTop", "WARN");
    saveArr(muteTop, "muteTop", "MUTE");
    saveArr(kickTop, "kickTop", "KICK");
    saveArr(banTop, "banTop", "BAN");
    //console.log(warnTop);
    // for (let i = 0; i < 10; i++) {
    //   console.log(`${i + 1}. ${sorted[i][0]} has ${sorted[i][1]} warns`);
    // }
  }
  //   if (ix % 500 === 0) {
  //     console.clear();
  //     console.log((ix / users.length).toFixed(2) + "%");
  //   }

  //logPercent(ix, users);
}
users.forEach((user, ix) => {
  setTimeout(() => {
    main(user, ix);
  }, 300 * (ix + 1));
});

function logPercent(ix, users) {
  console.clear();
  console.log(
    `${ix} / ${users.length}\n` + (ix / users.length).toFixed(2) * 100 + "%"
  );
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

function dumpToJSON(arr, fileName) {
  require("fs").writeFile(
    `./lbs/${fileName}.json`,
    JSON.stringify(arr),
    function (err) {
      if (err) {
        console.error("it broke. . .");
      }
    }
  );
}

function makeOneDimensional(arr, type) {
  let newArr = [];
  arr.forEach((element) => {
    newArr.push([element[0], element[1]]);
  });
  return newArr;
}

function saveArr(arr, filename, type) {
  dumpToJSON(makeOneDimensional(arr, type), filename);
}
