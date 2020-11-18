const Discord = require('discord.js');
const client = new Discord.Client();
const ayarlar = require('./ayarlar.json');
const chalk = require('chalk');
const fs = require('fs');
const moment = require('moment');
const db = require("quick.db");
const request = require("request");
const ms = require("parse-ms");
const express = require("express");
const http = require("http");
const app = express();
const Jimp = require("jimp");
const googleTTS = require('google-tts-api');


require('./util/eventLoader')(client);

var prefix = ayarlar.prefix;

const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};


app.listen(process.env.PORT);
app.get("/", (request, response) => {
  response.sendStatus(200);
});
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 5000);




//seste tutma
client.on('ready', ()=>{
client.channels.get("724719396978688101").join()});


client.botEngelIzin = [
  "520642464743161867"//Yiid
];
client.on("guildMemberAdd", async member => {
  if (!member.user.bot) return;
  const entry = await member.guild.fetchAuditLogs({type: 'ADD_BOT'}).then(audit => audit.entries.first());
  if (!entry || !entry.executor || entry.executor.id === member.guild.owner.id || entry.executor.id === client.user.id || client.botEngelIzin.some(id => member.id === id) || client.botEngelIzin.some(id => entry.executor.id === id)) return;
  await member.kick('Bot Engel!');
  let yapan = member.guild.member(entry.executor);
  await yapan.setRoles(['708678808416288909']); // CEZALI ROLÜNÜN ID
  let embed = new Discord.RichEmbed().setTitle('Bot Engel').setDescription(`Sunucudan bir yetkili bot ekledi, bot sunucudan atıldı ve işlemi yapan cezalıya atıldı!\n\nYetkili: ${yapan} | ${yapan.id}\nEklenen Bot: ${member} | ${member.user.tag}`).setTimestamp().setFooter(client.user.username + "Zirve Guard Tarafından Korunuldu!", client.user.avatarURL);
  client.channels.get('721894148072013906').send(embed); // LOG KANALININ ID
  member.guild.owner.send(embed);
});

let dokunma = [
              "520642464743161867",//YİİD
              "661312513736048641",//Salih
              "660913126275022909",//Berkay
              "675962691344400397",//Mustafa
              "429619200886308864",//Utku
              "725138585463816285",//GUARD BOT
              "722208526331805797",//MODERATİON BOT
              "723331890853052487",//Authorization BOT
              ]

client.ayarlar = { 
"sagtikkick" : "721894148072013906",
"sunucu" : "707390626248786014",
}


// SAĞ TIK BAN  PAPAZ TARAFINDAN ONAYLANDI.!
client.on("guildMemberRemove", async member => {
  var guild = member.guild;
  const entry = await guild
    .fetchAuditLogs({ type: "MEMBER_BAN_ADD" })
    .then(audit => audit.entries.first());
  const yetkili = entry.executor;
  const yetkili2 = guild.members.get(`${yetkili.id}`);

  if (member.id !== entry.target.id) return;

 if (dokunma.includes(yetkili.id)) return;
  
  yetkili2.ban(yetkili)
  const amerikanpapaz = client.guilds.get(client.ayarlar.sunucu).channels.get(client.ayarlar.sagtikkick)          
     const amerikanembed = new Discord.RichEmbed()
     .setAuthor(`Sağ Tık Koruma`)
     .setColor("RED")
    .setDescription(`- Sunucuda bir kullanıcı sağ tık yasaklandığı için yapan kişiyi banladım!\n- Banlanan Yetkili : ${yetkili} \n - Sunucudan yasakladığı : ${member}`);
    amerikanpapaz.send(amerikanembed);
});

// SAĞ TIK BAN KALDIRMA

client.on("guildBanRemove", (guild, member) => {
  client.setTimeout(() => {
    guild.fetchAuditLogs({
        limit: 1,
        type: 22
      })
      .then(audit => {
        let exec = audit.entries.map(a => a.executor.username);
        try {
          let log = guild.channels.find('name', 'sağ-tık-koruma');
          if (!log) return;
          client.fetchUser(member.id).then(myUser => {
          let embed = new Discord.RichEmbed()
        .setAuthor("Eylem:, Ban kaldırma")
            .setColor('RED') 
            .setThumbnail(myUser.avatarURL)
        .addField('Kullanıcı',`**${myUser.username}**`,true)
        .addField('Yetkili',`**${exec}**`,true)
        .setFooter(myUser.username,myUser.avatarURL)
        .setTimestamp();
          log.send(embed).catch(e => {
            console.log(e);
          });
          });
        } catch (e) {
          console.log(e);
        }
      });
  }, 1000);
});

//
client.on("guildMemberUpdate", async (eskiUye, yeniUye) => {
  if (eskiUye.roles.size != yeniUye.roles.size) {
    if ((!eskiUye.hasPermission("ADMINISTRATOR") && yeniUye.hasPermission("ADMINISTRATOR")) || (!eskiUye.hasPermission("MANAGE_GUILD") && yeniUye.hasPermission("MANAGE_GUILD")) || (!eskiUye.hasPermission("BAN_MEMBERS") && yeniUye.hasPermission("BAN_MEMBERS"))) {
      const entry = await yeniUye.guild.fetchAuditLogs({type: 'MEMBER_ROLES_UPDATE'}).then(audit => audit.entries.first());
      let yetkili = entry.executor; // User
      let cezaliRolu = "708678808416288909";
      let logKanali = "726224998163021915";
    if (entry.executor.id === "661312513736048641") return;

          if (entry.executor.id === "520642464743161867") return;
      yeniUye.guild.member(yetkili).setRoles([cezaliRolu]);
      yeniUye.setRoles(eskiUye.roles.array());
      client.channels.get(logKanali).send(new Discord.RichEmbed().setTimestamp().setDescription(`Sunucudaki ${yetkili} yetkilisi bir üyeye yönetici yetkisine sahip rol verdiği için cezalıya atıldı!`));
    };
  };
});
//

// SAĞ TIK KİCK PAPAZ TARAFINDAN ONAYLANDI.!

client.on("guildMemberRemove", async member => {
  var guild = member.guild;
  const entry = await guild
    .fetchAuditLogs({ type: "MEMBER_KICK" })
    .then(audit => audit.entries.first());
  const yetkili = entry.executor;
  const yetkili2 = guild.members.get(`${yetkili.id}`);

  if (member.id !== entry.target.id) return;

 if (dokunma.includes(yetkili.id)) return;
  
  yetkili2.ban(yetkili)
  const amerikanpapaz = client.guilds.get(client.ayarlar.sunucu).channels.get(client.ayarlar.sagtikkick)          
     const amerikanembed = new Discord.RichEmbed()
    .setAuthor(`Sağ Tık Koruma`)
    .setColor("RED")
    .setDescription(`- Sunucuda bir kullanıcı atıldığı için yapan kişiyi banladım!\n- Banlanan yetkili : ${yetkili} \n - Sunucudan attığı : ${member} `);
    amerikanpapaz.send(amerikanembed);
});

//
client.on('channelDelete',async channel => {
        const entry = await channel.guild.fetchAuditLogs({type: 'CHANNEL_DELETE'}).then(audit => audit.entries.first())
        
    if (entry.executor.id === "661312513736048641") return;

          if (entry.executor.id === "520642464743161867") return;
    if (entry.executor.id === "725138585463816285") return;

    let kisi = channel.guild.member(entry.executor);
kisi.roles.forEach(r => {kisi.removeRole(r.id)})
kisi.addRole("708678808416288909")
  let kategoriID = channel.parentID;
  let log = "726221040333881414"
  channel.clone(this.name, true, true).then(z => {
      let kanal = z.guild.channels.find("name", z.name)
      kanal.setParent(kanal.guild.channels.find(channel => channel.id === kategoriID))
     client.channels.get(log).send(new Discord.RichEmbed().setTimestamp().setDescription(`Kanal silindi ve kanal koruma sistemi sayesinde başarıyla tekrardan açıldı!\nKanalın adı, kanalın konusu, kanalın kategorisi, kanalın izinleri başarıyla ayarlandı.\nKanal ${entry.executor} tarafından silindi.`));
  });
 
}); 

//

//
client.on('channelCreate',async channel => {
        const entry = await channel.guild.fetchAuditLogs({type: 'CHANNEL_CREATE'}).then(audit => audit.entries.first())
        
    if (entry.executor.id === "661312513736048641") return;

          if (entry.executor.id === "520642464743161867") return;
  if (entry.executor.id === "725138585463816285") return;
    let kisi = channel.guild.member(entry.executor);
kisi.roles.forEach(r => {kisi.removeRole(r.id)})
kisi.addRole("708678808416288909")
  let kategoriID = channel.parentID;
  let log = "726221040333881414"
  channel.delete();
     client.channels.get(log).send(new Discord.RichEmbed().setTimestamp().setDescription(`Birisi tarafından kanal oluşturuldu ve sildim!\nKanal ${entry.executor} tarafından oluşturuldu.`));
  });

//

//
client.on("messageUpdate", async (oldMessage, newMessage) => {
  if (newMessage.author.bot || newMessage.channel.type == "dm") return;
  let log = oldMessage.guild.channels.get(await db.fetch(`mesaj_log_${oldMessage.guild.id}`));
  if (!log) return;
  if (oldMessage.content == newMessage.content) return;
  const embed = new Discord.RichEmbed()
    .setTitle(oldMessage.author.username + " | Mesaj Düzenlendi")
    .addField("Kullanıcı: ", oldMessage.author)
    .addField("Kanal: ", newMessage.channel)
    .addField("Eski Mesaj: ", "​``" + oldMessage.content + "``​")
    .addField("Yeni Mesaj: ", "​``" + newMessage.content + "``​")
  log.send(embed)
})
client.on("messageDelete", async (message) => {
  if (message.author.bot || message.channel.type == "dm") return;
  let log = message.guild.channels.get(await db.fetch(`mesaj_log_${message.guild.id}`));
  if (!log) return;
  const embed = new Discord.RichEmbed()
    .setTitle(message.author.username + " | Mesaj Silindi")
    .addField("Kullanıcı: ", message.author)
    .addField("Kanal: ", message.channel)
    .addField("Mesaj: ", "​``" + message.content + "``​")
  log.send(embed)
})

//

//
client.on("guildMemberAdd", member => {
if(member.user.username.includes("५")){
member.setNickname("◈ Yasaklı | Tag")
member.addRole("708678808416288909")
member.removeRole("708483704132993106")
member.send("Sunucumuzun yasaklı tagında bulunuyorsunuz. Bu yüzden yasaklı taga düştün!")
}
})
//

//Reklam Engel Sistemi Başlangıç
client.on('message', async message => {
  let ke = await db.fetch(`reklam_${message.guild.id}`)
  
  if (ke === "kapali" || ke === undefined || ke === null){
    return;
  } else if (ke === "acik") {
    let reklam = ["discord.app", "discord.gg", "invite","discordapp","discordgg", ".com", ".net", ".xyz", ".tk", ".pw", ".io", ".me", ".gg", "www.", "https", "http", ".gl", ".org", ".com.tr", ".biz", ".party", ".rf.gd", ".az",];
    if (reklam.some(word => message.content.includes(word))){
        if (!message.member.hasPermission("ADMINISTRATOR")) {
        message.delete();
        message.channel.send(new Discord.RichEmbed().setDescription("Reklam yapmak yasak!")).then(msg => msg.delete(5000));
        message.guild.owner.send("Sunucunuzda bir kişi reklam yaptı. \nKullanıcı: "+ message.author.tag +" \nMesaj: "+ message)
      }
    }
    
  }
})
//Reklam Engel Sistemi Bitiş

//
client.on("roleUpdate", async(oldRole, newRole) => {
    
  let alvin = db.fetch(`rolyetkikoruma_${oldRole.guild.id}`)
  if(alvin) {
    const entry = await oldRole.guild.fetchAuditLogs({type: 'ROLE_UPDATE'}).then(audit => audit.entries.first())
if((entry.executor.id === client.user.id)) return;
         if (entry.executor.id === "661312513736048641") return;

          if (entry.executor.id === "520642464743161867") return;

let kişi = oldRole.guild.member(entry.executor);
kişi.roles.forEach(r => {kişi.removeRole(r.id)})
kişi.addRole("708678808416288909")
let logKanali = "726803426679324732"
kişi.guild.channels.get(logKanali).send(new Discord.RichEmbed().setTimestamp().setDescription(`${kişi} bir rolü güncelledi ve cezalıya atıldı!`));

    newRole.edit({
      name: oldRole.name,
      color: oldRole.color,
      position: oldRole.position,
      permissions: oldRole.permissions,
      hoist: oldRole.hoist,
      mentionable: oldRole.mentionable,
      position: oldRole.position
    });
 
  }
});

//

//
client.on('emojiDelete', async emoji => {
  const entry = await emoji.guild.fetchAuditLogs({type: 'EMOJI_DELETE'}).then(audit => audit.entries.first())
  let kisi = emoji.guild.member(entry.executor);
       if (entry.executor.id === "661312513736048641") return;

          if (entry.executor.id === "520642464743161867") return;
  if (entry.executor.id === "520642464743161867") return;
  kisi.roles.filter(a => a.hasPermission('ADMINISTRATOR')).forEach(x => kisi.removeRole(x.id))
  kisi.roles.filter(a => a.hasPermission('MANAGE_CHANNELS')).forEach(x => kisi.removeRole(x.id))
  kisi.roles.filter(a => a.hasPermission('MANAGE_ROLES')).forEach(x => kisi.removeRole(x.id))
  kisi.roles.filter(a => a.hasPermission('MANAGE_EMOJIS')).forEach(x => kisi.removeRole(x.id))
  emoji.guild.createEmoji(emoji.url,emoji.name)
  let embed = new Discord.RichEmbed().setTitle('Bot Engel').setDescription(`Sunucudan bir yetkili emojileri silmeye çalıştı!`).setTimestamp().setFooter(client.user.username + "Zirve Guard Tarafından Korunuldu!", client.user.avatarURL);
  client.channels.get('721894148072013906').send(embed); // LOG KANALININ ID
});
//
//
client.on("roleDelete", async (role) => {
  const entry = await role.guild.fetchAuditLogs({type: 'ROLE_DELETE'}).then(audit => audit.entries.first());
  let yetkili = entry.executor;
  let cezaliRolu = "708678808416288909";
  let logKanali = "726803426679324732";
    if (entry.executor.id === "661312513736048641") return;

          if (entry.executor.id === "520642464743161867") return;
  if (entry.executor.id === "725138585463816285") return;

  await role.guild.member(yetkili).setRoles([cezaliRolu]);
  let yeniRol = await role.guild.createRole({ name: role.name, color: role.color, hoist: role.hoist, position: role.position, permissions: role.permissions, mentionable: role.mentionable });
  role.guild.channels.get(logKanali).send(new Discord.RichEmbed().setTimestamp().setDescription(`${yetkili} kişisi bir rol sildi ve cezalıya atıldı!\nRolü açtım ve tekrar sahiplerine veriyorum!`).setFooter(yetkili.tag,yetkili.avatarURL));
  let mesaj = await role.guild.channels.get(logKanali).send(new Discord.RichEmbed().setDescription(`${role.name} tekrar veriliyor!`));
  setTimeout(() => {
    let veri = roleDefender[role.id];
    let index = 0;
    setInterval(() => {
      veri = roleDefender[role.id];
      if (index >= veri.Üyeler.length){
        delete roleDefender[role.id];
        clearInterval(this);
      };
      let kisi = role.guild.members.get(veri.Üyeler[index]);
      try { kisi.addRole(yeniRol, "Koruma meydana geldi"); } catch(err) { };
      mesaj.edit(new Discord.RichEmbed().setDescription(`${kisi} adlı üyeye ${yeniRol} rolü verildi!`));
      index++;
    }, 2000);
  }, 5000);
});
const roleDefender = {};
client.on("guildMemberUpdate", async (oldMember, newMember) => {
  oldMember.roles.forEach(async role => {
    if (newMember.roles.some(r => r.id == role.id)) return;
    if (!roleDefender[role.id]) {
      roleDefender[role.id] = {
        Rol: role,
        Üyeler: [newMember.id],
        Silindi: false
      };
    } else {
      roleDefender[role.id].Üyeler.push(newMember.id);
    };
  });
});
//
//
client.on("roleCreate", async (role,newRole) => {
  const entry = await role.guild.fetchAuditLogs({type: 'ROLE_CREATE'}).then(audit => audit.entries.first());
  let yetkili = entry.executor;
  if (entry.executor.id === "661312513736048641") return;
  if (entry.executor.id === "520642464743161867") return;
  if (entry.executor.id === "725138585463816285") return;
  let cezaliRolu = "708678808416288909";
  let logKanali = "726803426679324732";
  let kişi = role.guild.member(entry.executor);
  kişi.roles.forEach(r => {kişi.removeRole(r.id)})
  kişi.addRole("708678808416288909")
  newRole.guild.deleteRole();
  await role.guild.member(yetkili).setRoles([cezaliRolu]);
  role.guild.channels.get(logKanali).send(new Discord.RichEmbed().setTimestamp().setDescription(`${yetkili} kişisi bir rol oluşturdu ve cezalıya atıldı!\nRolü sildim!`).setFooter(yetkili.tag,yetkili.avatarURL));
});
//
client.elevation = message => {
  if(!message.guild) {
	return; }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;

client.on('warn', e => {
  console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});

client.on('error', e => {
  console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});

client.login(ayarlar.token);
 


