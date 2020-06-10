const commands = new Map([["baltop", 5]]);

let commandCooldown = new Map([["baltop", new Map()]]);

const handler = function (message, command, resolve, reject) {
  let delay = () => {
    setTimeout(() => {
      commandCooldown.get(command).delete(message.author.id);
      //   message.channel.send(
      //     `${message.member} cooldown has expired for ${command} command.`
      //   );
    }, commands.get(command) * 1000);
  };

  if (commandCooldown.get(command).has(message.author.id)) {
    let init = commandCooldown.get(command).get(message.author.id);
    let curr = new Date();
    let diff = (Math.round = (curr - init) / 1000);
    let time = commands.get(command);
    message.channel.send(
      `${(time - diff).toFixed(2)} seconds left for ${command} command.`
    );
  }

  if (commandCooldown.get(command).has(message.author.id)) {
    reject();
  } else {
    if (command === "baltop") {
      resolve();
      commandCooldown.get(command).set(message.author.id, new Date());
      delay();
    }
  }
};

module.exports = { commands, commandCooldown, handler };
