
const Discord = module.require("discord.js");
const { MessageMentions, User } = require("discord.js");
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();
module.exports.run = async (client, message, prefix, db, lastArrayValue, userId, roles) => {

  let completeOperation = '';
  function insertMembersToDb(userIdCount) {

    if (userId.length <= 0) return false;

    return new Promise((resolve, reject) => {
      for (let i = 0; i < userId.length; i++) {
        db.run(`INSERT or IGNORE into dataPoints(id, points) VALUES ( ? , "0")`, [userId[i]], (error) => {
          if (error) {
            reject();
            db.close();
            return console.log(error.message)
          } else {
            resolve();
          }
        });
      }
    })
  }

  function userIdApproving() {
    if (userId.length <= 0) {
      message.channel.send("Поле \"@имя\" было введено неправильно. Пример: -очки @имя1 @имя2 @имя3 100")
      return false
    } else {
      return true
    }
  }

  function execSelect(myQuery, userIdCount) {

    return new Promise((resolve, reject) => {

      let dataSelect = [userIdCount];

      setTimeout(() => {
        db.get(myQuery, dataSelect, (error, row) => {

          if (error) {
            reject();
            db.close();
            return console.log(error.message)
          } else if (typeof (row) !== 'undefined') {
            completeOperation += "<@!" + userIdCount + ">" + " " + row.points + '\n';
            resolve();
          }
        });
      }, 2000);
    });
  };

  async function getPoints() {
    try {

      for (let i = 0; i < userId.length; i++) {
        await execSelect(` SELECT points FROM dataPoints WHERE id = ? `, userId[i]);
        if (userId) {
          const exampleEmbed = new Discord.MessageEmbed()
            .setColor('LUMINOUS_VIVID_PINK')
            .setTitle('Очки:')
            .setDescription(completeOperation)
          message.channel.send({ embeds: [exampleEmbed] });
        }

        db.close();
      }
    } catch (error) {
      const exampleEmbed = new Discord.MessageEmbed()
        .setColor('LUMINOUS_VIVID_PINK')
        .setTitle('Рейтинг участников:')
        .setDescription("Пользователь не найден.")
        .setThumbnail("https://images-ext-2.discordapp.net/external/48Fc2QUkKPSXnWhc7LrLMcO8DbEU55jUmESGU5cpNjg/https/media.discordapp.net/attachments/748246331730165781/870236960407576617/3e2c53e8ba65b1da.png?width=635&height=498");
      message.channel.send({ embeds: [exampleEmbed] });
    }
  }

  if (userIdApproving() && insertMembersToDb()) {
    insertMembersToDb()
    getPoints();
  }
  db.close();
}
module.exports.help = {
  name: "очки"
};