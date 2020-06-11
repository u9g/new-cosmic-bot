module.exports = ({ bot: bot }) => {
  bot.on("kicked", (reason, loggedIn) => {
    console.log(
      `The bot was kicked for ${reason}, it ${
        loggedIn ? "was" : "wasn't"
      } logged in.`
    );
  });
};
