// SlashCommandBuilder という部品を discord.js からインポートしています。
// これにより、スラッシュコマンドを簡単に構築できます。
const { SlashCommandBuilder } = require('discord.js');

// 以下の形式にすることで、他のファイルでインポートして使用できるようになります。

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('このBotは何ができるの？'),
	execute: async function(interaction) {
		await interaction.reply('気象庁のAPIを使用したDIscordBotです。緊急地震速報や、大雨、雷警報など、警報が発令されたときにサーバー上で速報を行うBotです。\n`/getquake`で最新の地震情報を取得できます。');
	},
};


// module.exportsの補足
// キー・バリューの連想配列のような形で構成されています。
//
// module.exports = {
//    キー: バリュー,
//    キー: バリュー,
// };
//