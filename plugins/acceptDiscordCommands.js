module.exports = () => {
  client.on("message", (msg) => {
    if (
      msg.content.startsWith("> ") &&
      msg.author.id === "424969732932894721"
    ) {
      bot.chat(msg.content.substring(2));
    }
  });
};
