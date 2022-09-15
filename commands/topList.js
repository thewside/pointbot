
const Discord = module.require("discord.js");
const { MessageMentions, User } = require("discord.js");
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();
const thumb = "imagepath";

module.exports.run = async (client, message, prefix, db, lastArrayValue, userId, roles) => {
    let userTopList = "";
    function execList(myQuery, lastArrayValue) {
        return new Promise((resolve, reject) => {
            let i = 1;
            let limit = [lastArrayValue];

            if (lastArrayValue > 10 || lastArrayValue < 1 || typeof (lastArrayValue) === "undefined") {
                limit = [5];
            }

            setTimeout(() => {
                db.all(myQuery, limit, (error, rows) => {
                    if (error) {
                        reject();
                        db.close();
                        console.log(rows)
                        return console.log(error.message)

                    } else {
                        console.log(rows)
                        if (rows === "undefined") return
                        rows.forEach(element => {
                            userTopList += '\n' + i++ + ". " + "<@!" + element.id + ">" + "  " + element.points;
                        });

                        if (userTopList === "") {
                            reject()
                            db.close()
                        } else {
                            resolve()
                        }
                    };
                });

            }, 2000)

        })
    }

    async function getTopList() {
        try {
            await execList(` SELECT id, points FROM dataPoints ORDER BY points DESC LIMIT ? `, lastArrayValue);
            const exampleEmbed = new Discord.MessageEmbed()
                .setColor('LUMINOUS_VIVID_PINK')
                .setTitle('Рейтинг участников:')
                .setDescription(userTopList)
                .setThumbnail(thumb);
            message.channel.send({ embeds: [exampleEmbed] });
            db.close();
        } catch (error) {
            const exampleEmbed = new Discord.MessageEmbed()
                .setColor('LUMINOUS_VIVID_PINK')
                .setTitle('Рейтинг участников:')
                .setDescription("Список участников пуст.")
                .setThumbnail(thumb);
            message.channel.send({ embeds: [exampleEmbed] });
        }
    }
    getTopList();
    db.close()
};

module.exports.help = {
    name: "топ"
};