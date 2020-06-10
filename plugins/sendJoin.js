module.exports = ({ bot, util }) => {
  bot.on("message", function (msg) {
    const fullText = util.GenerateFullText(msg);

    if (fullText.includes("(!) DOWNLOAD COSMIC CLIENT (!)")) {
      bot.chat("/join");
      console.log("Successfully logged in!");
    }
  });
};
