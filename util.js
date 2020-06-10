exports.mineflayerOptions = () => {
  const config = require("./login.json");
  const options = {
    host: config["server-ip"],
    port: 25565,
    username: config["username"],
    password: config["password"],
  };
  return options;
};

exports.discordToken = () => {
  return require("./login.json")["discord-token"];
};

exports.GenerateFullText = (msg) => {
  let fullText = "";
  if (msg["extra"]) {
    msg["extra"].forEach((element) => (fullText += element));
  }
  return fullText;
};
