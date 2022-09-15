
  const Discord = module.require("discord.js");
  const fs = require("fs");
  const sqlite3 = require("sqlite3").verbose();
  module.exports.run = async (client, message, prefix, db, lastArrayValue, userId, roles) => {
    const exampleEmbed = new Discord.MessageEmbed()
    .setColor('LUMINOUS_VIVID_PINK')
    .setTitle('Команды:')
    .setDescription(`
    1. -дать @тег1 @тег2 количество очков | выдать юзеру\/юзерам очки.
    2. -забрать @тег1 @тег2 количество очков | забрать у юзера\/юзеров очки.
    3. -топ 1-10  количество очков | топ юзеров по очкам от 1 до 10 (вводится любое число до 10, по умолчанию 5).
    4. -очки @тег1 @тег2 | Узнать сколько очков у определенных участников.
    `);
    message.channel.send({ embeds: [exampleEmbed] });
  };

  module.exports.help = {
    name: "команды"
};