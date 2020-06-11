var schedule = require("node-schedule");
let showingPeople = false;
let counter = 0;
let igns = [];
const regex = {
  lastTopIsland: /^Top Player Islands \(333\/333\)$/,
};

module.exports = ({ bot, client, util }) => {
  bot.on("spawn", function () {
    //schedule check all istop pages
    var startSched = schedule.scheduleJob("0 0 * * *", scheduleMessage(bot));
  });

  // client.on("message", (msg) => {
  //   if (msg.content === ">>>dump") {
  //     dumpIgns(igns);
  //   } else if (msg.content.startsWith(">>>get")) {
  //     const count = msg.content.substring(">>>get".length + 1);
  //     requestAllIsTops(count, bot);
  //   }
  // });

  bot.on("message", function (msg) {
    const fullText = util.GenerateFullText(msg);
    if (fullText.includes("Top Player Islands")) {
      showingPeople = true;
    } else if (showingPeople) {
      counter++;
      let ign = getIgn(fullText);
      igns.push(ign);
    }
    if (counter === 15) {
      showingPeople = false;
      counter = 1;
    }
    if (igns.length === 4995) {
      console.log(["[generateIgns] has finished."]);
      dumpIgns(igns);
      require("./helperPunTop.js");
    }
  });
};
function scheduleMessage(bot) {
  return function () {
    const count = 333;
    requestAllIsTops(count, bot);
    //bot.chat("/w pv1 hello");
  };
}

function getIgn(fullText) {
  let ign = fullText
    .substring(0, fullText.indexOf("("))
    .substring(0, fullText.lastIndexOf(" "))
    .trim();
  ign = ign.substring(ign.lastIndexOf(" ")).trim();
  return ign;
}
function dumpIgns(igns) {
  require("fs").writeFile("./lbs/users.json", JSON.stringify(igns), function (
    err
  ) {
    if (err) {
      console.error("it broke. . .");
    }
  });
}
function requestAllIsTops(count, bot) {
  for (let i = 1; i <= count; i++) {
    setTimeout(() => {
      bot.chat("/is top " + i);
    }, 3000 * i);
  }
}
