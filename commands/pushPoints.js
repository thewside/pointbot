const Discord = module.require("discord.js");
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();

module.exports.run = async (client, message, prefix, db, lastArrayValue, userId, roles) => {

  if (message.member.roles.cache.has(roles.ID_CONTRIBUTOR) ||
    message.member.roles.cache.has(roles.ID_ENGINEER) ||
    message.member.roles.cache.has(roles.ID_ADMIN) ||
    message.member.roles.cache.has(roles.ID_ROOT)) {

    let completeOperation = '';

    function execInsertToDb(myQuery, userIdCount) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          db.run(myQuery, userIdCount, (error) => {
            if (error) {
              reject();
              db.close();
              return console.log(error.message)
            } else {
              resolve();
            }
          });
        }, 2000)
      })
    }


    function execUpdatePoints(myQuery, userIdCount) {
      return new Promise((resolve, reject) => {
        let dataUpdate = [lastArrayValue, lastArrayValue, userIdCount];
        setTimeout(() => {
          db.run(myQuery, dataUpdate, (error) => {
            if (error) {
              reject();
              db.close();
              return console.log(error.message)
            } else {
              resolve();
            }
          });

        }, 4000);


      })
    }

    function execGetPoints(myQuery, userIdCount) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          db.get(myQuery, userIdCount, (error, row) => {

            if (error) {
              reject();
              db.close();
              return console.log(error.message)
            } else {
              completeOperation += "<@!" + userIdCount + ">" + " " + row.points + '\n';
              resolve();
            }
          });
        }, 4000);
      });
    };

    async function insertToDb() {
      for (let i = 0; i < userId.length; i++) {
        await execInsertToDb(`INSERT or IGNORE into dataPoints(id, points) VALUES (?, "0")`, [userId[i]]);
      }
    }

    async function updatePoints() {
      for (let i = 0; i < userId.length; i++) {
        await execUpdatePoints(`UPDATE dataPoints SET points = CASE WHEN points + ? > 1000000 THEN 1000000 ELSE points + ? END WHERE id=?;`, userId[i]);
      }
    }

    async function getPoints() {
      for (let i = 0; i < userId.length; i++) {
        await execGetPoints(` SELECT points FROM dataPoints WHERE id = ? `, [userId[i]]);
      }
      const exampleEmbed = new Discord.MessageEmbed()
        .setColor('LUMINOUS_VIVID_PINK')
        .setTitle('Очков:')
        .setDescription(completeOperation);

      if (completeOperation.length !== 0) {
        message.channel.send({ embeds: [exampleEmbed] });
        db.close()
      } else {
        message.channel.send("Поле \"@имя\" было введено неправильно. Пример: -дать @имя1 @имя2 @имя3 100");
        db.close()
      }
    }



    async function execDb() {
      if (userId.length >= 1 || userId !== '') {
        if (!(lastArrayValue.startsWith('<@') &&
          lastArrayValue.endsWith('>') ||
          lastArrayValue.startsWith('-') ||
          lastArrayValue.replace(/[\D]/g, '') === '' || userId === '')) {
          insertToDb();
          updatePoints();
          getPoints();
        } else {
          message.channel.send("Поле \"очки\" было введено неправильно. Пример: -дать @имя1 @имя2 @имя3 100")
        }
        //
      } else {
        console.log("args false")
        message.channel.send("Поле \"@имя\" было введено неправильно. Пример: -дать @имя1 @имя2 @имя3 100")
      }
    }
    execDb()
  };
  db.close();
}

module.exports.help = {
  name: "дать"
};