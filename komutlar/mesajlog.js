const db = require('quick.db')

module.exports.run = async (bot, message, args) => {

  
  const channel = message.mentions.channels.first();
  if (!channel) return message.reply("bir kanal belirtin.")
  
  db.set(`mesaj_log_${message.guild.id}`, channel.id)
  message.reply("mesaj log kanalı <#" + await db.fetch(`mesaj_log_${message.guild.id}`) + "> olarak ayarlandı.")
  
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: 3,
    kategori: "Moderatör Komutları"
};
  
  exports.help = {
    name: 'mesaj-log',
    description: 'Mesaj log kanalını ayarlar.',
    usage: 'mesaj-log'
};