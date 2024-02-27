//RESTとRoutesをdiscord.jsパッケージからインポート
const { REST, Routes } = require('discord.js');

// hey.jsのmodule.exportsを呼び出し
const helpFile = require('./commands/help.js');
const weatherFile = require('./commands/weather.js');
const getquakeFile = require('./commands/getquake.js')
require('dotenv').config();
const token = process.env.token
const applicationId=process.env.application_id

// 登録コマンドを呼び出してリスト形式で登録
const commands = [
                  helpFile.data.toJSON(),
                  weatherFile.data.toJSON(),
                  getquakeFile.data.toJSON(),
                 ];


// DiscordのAPIには現在最新のversion10を指定
const rest = new REST({ version: '10' }).setToken(token);

// Discordサーバーにコマンドを登録
(async () => {
    try {
        rest.put(
            Routes.applicationCommands(applicationId),
            { body: commands },
        );
        // 重複したギルドコマンドを削除するためのコード
        /*
        clientId = '1105007814721687553'
        guildId = '1109706393545621643'
        await rest.get(Routes.applicationGuildCommands(clientId, guildId))
        .then(commands => {
            const command = commands.find(command => command.name === 'hey');
            console.log(`コマンドID: ${command.id}`);
            commandId = command.id
        })
        .catch(console.error);
        await rest.delete(Routes.applicationGuildCommand(clientId, guildId,commandId))
        .then(() => console.log('コマンドを削除しました'))
        */

        console.log('コマンドが登録されました！');
    } catch (error) {
        console.error('コマンドの登録中にエラーが発生しました:', error);
    }
})();