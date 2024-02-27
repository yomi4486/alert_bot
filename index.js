// discord.jsライブラリの中から必要な設定を呼び出し、変数に保存
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const token = process.env.token
// クライアントインスタンスを作成
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const fs = require('fs');
const path = require('path');
// クライアントオブジェクトが準備OKとなったとき実行
client.once(Events.ClientReady, c => {
	console.log(`${c.user.tag}がログインします。`);
});

client.commands = new Collection();
// commandsフォルダから、.js拡張子のファイルを取得
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// 取得した.jsファイル内の情報から、コマンドと名前をListenner-botに対して設定
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING]  ${filePath} のコマンドには、必要な "data" または "execute" プロパティがありません。`);
	}
}

// コマンドが送られてきた際の処理
client.on(Events.InteractionCreate, async interaction => {
    // コマンドでなかった場合は早期リターン
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);
    // 一致するコマンドがなかった場合
	if (!command) {
		console.error(` ${interaction.commandName} というコマンドは存在しません。`);
		return;
	}
	try {
        // コマンドを実行
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'コマンドを実行中にエラーが発生しました！', ephemeral: true });
	}
});


// ログイン
client.login(token);