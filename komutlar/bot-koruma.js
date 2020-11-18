const Discord = require('discord.js');

exports.run = async(client, message, args) => {
  if (message.author.id !== message.guild.owner.id) return message.reply('Sunucu sahibine özeldir!');
  if (!args[0] || isNaN(args[0])) return message.reply('Bot engel için izin verilecek botun veya yetkilinin IDsini belirtmelisin!');
  client.botEngelIzin.push(args[0]);
  message.reply(`${args[0]} bot koruma engeline 5 dakika boyunca dahil edilmeyecek!`);
  setTimeout(() => { client.botEngelIzin = client.botEngelIzin.filter(id => id !== args[0]); }, 5*60*1000); //NOT : Eğer süreyi 5 dakika değilde başka süre yapmak isterseniz örn 15 dakika bu kısmı (5*60*1000) şu şekilde düzenleyin = 15*60*1000
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};

exports.help = { 
  name: 'bot-engel-izin', 
  description: 'Bot engel koruması için belirtilen idye izin verir.',
  usage: 'bot-engel-izin',
  kategori: 'yetkili'
};