const db = require('quick.db')
const Discord = require('discord.js')
const ayarlar = require('../ayarlar.json');

exports.run = async (client, message, args) => {
  
  
  let alvin = 'RANDOM'
  if (!args[0]) return message.channel.sendEmbed(new Discord.RichEmbed().setDescription(`Hata MESAJINIZ`).setColor(alvin));
  
  if (args[0] == 'aç') {
message.channel.sendEmbed(new Discord.RichEmbed().setDescription(` aç MESAJINIZ`).setColor(alvin));
db.set(`rolyetkikoruma_${message.guild.id}`, true)
  }
  if (args[0] == 'kapat') {
     message.channel.sendEmbed(new Discord.RichEmbed().setDescription(`kapat MESAJINIZ`).setColor(alvin));
db.delete(`rolyetkikoruma_${message.guild.id}`)
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['rolyetki'],
  permLevel: 4,
};

exports.help = {
  name: 'rolyetkiönleyici',

};
