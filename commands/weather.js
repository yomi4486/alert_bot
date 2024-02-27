// SlashCommandBuilderをdiscord.jsからインポート
const { SlashCommandBuilder,EmbedBuilder} = require('discord.js');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const request = require('request');
var weather_str,weather_icon,temp_str,max_temp_str,min_temp_str



function getWeather(location,interaction){
    if (location == undefined){
        location = "Tokyo"
    }
    return new Promise((resolve, reject) => {
        const resource = {
            url: `http://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&lang=ja&appid=ae7342f7dce00501078bca4e9df75bc9`,
            method: "GET",
            json: true,
        }
        try{
            request(resource, (error, res, body) => {
                if (error) {
                    reject(error);
                } else {
                    weather_str = body["weather"][0]["description"]
                    weather_icon = "https://openweathermap.org/img/wn/" + body["weather"][0]["icon"] + "@2x.png"
                    temp_str = body["main"]["temp"]
                    max_temp_str = body["main"]["temp_max"]
                    min_temp_str = body["main"]["temp_min"]
                    resolve([weather_str, weather_icon, temp_str, max_temp_str, min_temp_str]);
                }
            });
        } catch {
            interaction.reply("天気の取得に失敗しました")
            return
        }
    });
    
}
function location_str_to_japanese(str){
    locate_name = str.replace('Tokyo','東京').replace('Kyoto','京都').replace('Osaka','大阪')
                     .replace('Okayama','岡山').replace('Kumamoto','熊本').replace('Yamaguchi','山口')
    return locate_name;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('weather')
		.setDescription('天気をお伝えします')
        .addStringOption(option =>
            option
            .setName('locate')
            .setDescription('地域を選んでください')
            .setRequired(true)
            .addChoices(
                { name: "東京", value: "Tokyo" },
                { name: "大阪", value: "Osaka" },
                { name: "京都", value: "Kyoto" },
                { name: "岡山", value: "Okayama" },
                { name: "熊本", value: "熊本" },
                { name: "山口", value: "山口" },
            )
        ),
    execute: async function (interaction) {
        switch (interaction.options.getString()) {
            case "locate":
            default:
            {
                try{
                    weather_str, weather_icon, temp_str, max_temp_str, min_temp_str = getWeather(interaction.options.getString('locate'),interaction);
                } catch {
                    await interaction.reply("天気の取得に失敗しました")
                }
                await interaction.deferReply();
        
                // 処理を数秒遅らせる
                setTimeout(async function() {

                await interaction.editReply({embeds: [{
                    title: `今日の${location_str_to_japanese(interaction.options.getString('locate'))}の天気`,
                    color: 7506394,
                    timestamp: new Date(),
                    footer: {
                      text: "天気の情報はOpenWeatherMap APIを使用して取得しています。"
                    },
                    thumbnail: {
                      url: weather_icon.toString()
                    },
                    fields: [
                      {
                        name: "天気",
                        value: weather_str.toString()
                      },
                      {
                        name: "気温",
                        value: temp_str.toString() + "℃",
                        inline: true
                      },
                      {
                        name: "最高気温",
                        value: max_temp_str.toString() + "℃",
                        inline: true
                      },
                      {
                        name: "最低気温",
                        value: min_temp_str.toString() + "℃",
                        inline: true
                      }
                    ]
                }]});
            
                }, 600);
            }
        }
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