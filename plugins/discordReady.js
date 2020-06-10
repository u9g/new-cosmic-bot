module.exports = ({ client }) => {
  client.on("ready", () => {
    console.log(
      `The discord bot logged in! Username: ${client.user.username}!`
    );
  });
};
