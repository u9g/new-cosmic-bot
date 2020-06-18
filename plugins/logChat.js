const regex = {
  chat: /A?D?\s?\*?\*?\*?.+?(?=\s[a-zA-Z]+\s\[)\s?([a-zA-Z]+)\s\[([0-9]+)\]\s(.+?(?=:))\:\s(.+)/,
};
module.exports = ({ client, bot, discordConfig, Discord, chalk, util }) => {
  bot.on("message", (msg) => {
    console.log(msg.toString());
    msg
      .toString()
      .replace(regex.chat, function (match, rank, lvl, ign, message) {
        console.log(
          `${ign} is a rank ${rank} who is level ${lvl} who just said "${message}"`
        );
      });
  });
};
