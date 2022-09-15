const Discord = require('discord.js');
Client = Discord.Client;
Intents = Discord.Intents;
const client = new Client({intents: [
  Intents.FLAGS.GUILDS, 
  Intents.FLAGS.GUILD_MESSAGES, 
  Intents.FLAGS.GUILD_MEMBERS, 
  Intents.FLAGS.GUILD_MESSAGE_REACTIONS
]});

let roles = {
  ID_ADMIN:"paste_role_id", 
  ID_CONTRIBUTOR:"paste_role_id", 
  ID_ENGINEER:"paste_role_id", 
  ID_ROOT:"paste_role_id", 
  ID_TEST:"paste_role_id", 
  ID_TEST2:"paste_role_id"
}; 
const
  config = require('./config.json'),
  fs = require('fs'),
  commands = new Discord.Collection(),
  sqlite3 = require("sqlite3").verbose();
  console.log(require('discord.js').version);
client.once('ready', () => {
  console.log('Wake up!');
  let db = new sqlite3.Database('./data/dataPoints.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      console.log(err)
    }
    console.log('Connected')
    db.run("CREATE TABLE IF NOT EXISTS dataPoints(id TEXT NOT NULL UNIQUE, points INT UNSIGNED NOT NULL)");
    db.run("CREATE TABLE IF NOT EXISTS dataRevelantUsers(id TEXT NOT NULL UNIQUE, data TEXT)");
  })

    client.user.setActivity("Minecraft", { type: "PLAYING" });
  });
client.login(config.BOT_TOKEN);

fs.readdir("./commands", (err, files) => {
  if(err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === "js") 
  if (jsfile.length === 0) return console.log("Файлы с расширением js не найдены.")
  jsfile.forEach((f, i) => {
    let props = require(`./commands/${f}`);
    commands.set(props.help.name, props);
  })
})

client.on('messageCreate', message => {
  const prefix = config.prefix;
  if( message.author.bot || !message.content.startsWith(prefix) ) return;
  let messageArray = message.content.split(" ").filter(el => !!el);
  let command = messageArray[0];
  let args = messageArray.slice(1);
  let db = new sqlite3.Database('./data/dataPoints.db'); 
  let commandFile = commands.get(command.slice(prefix.length)) 
  let lastArrayValue = args.slice(-1).join("").replace(/[\D]/g, '');
  let userId = [];
  for (let i = 0; i < args.length; i++) {
    if (  args[i].startsWith('<@') && args[i].endsWith('>') ) {
      let argsSliced = args[i].replace(/[\D]/g, '')
      if (typeof( client.users.cache.get( `${argsSliced}`) ) !== 'undefined' )
           userId.push(argsSliced);
    }
  };
  if (commandFile) commandFile.run(client, message, prefix, db, lastArrayValue, userId, roles);
});



client.on('messageCreate', message => {
  let db = new sqlite3.Database('./data/dataPoints.db');
  function insertRevelantUser() {
    return new Promise((resolve, reject) => {
      db.run(`INSERT or IGNORE INTO dataRevelantUsers(id) VALUES(?);`, [message.author.id]), error => {
        if (error) {
          db.close();
          reject();
          console.log(error);
        } else {
          resolve();
        }
      }
    })
  }
  insertRevelantUser();
})