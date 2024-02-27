// SlashCommandBuilderをdiscord.jsからインポート
const { SlashCommandBuilder,EmbedBuilder, Colors} = require('discord.js');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const request = require('request');
var time,locate,max_scale,mag
var colorcode


function getquake(){
    return new Promise((resolve, reject) => {
        const resource = {
            url: `https://api.p2pquake.net/v2/jma/quake`,
            method: "GET",
            json: true,
        }
        request(resource, (error, res, body) => {
            if (error) {
                reject(error);
            } else {
                time = body[0]["earthquake"]["time"]
                locate = body[0]["earthquake"]["hypocenter"]["name"]
                max_scale = body[0]["earthquake"]["maxScale"]
                depth = body[0]["earthquake"]["hypocenter"]["depth"]
                mag = body[0]["earthquake"]["hypocenter"]["magnitude"]
                resolve([time, locate, max_scale, mag]);
            }
        });
    });
    
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('getquake')
		.setDescription('最新の地震情報をお伝えします')

        ,
    execute: async function (interaction) {
                time, locate, max_scale, mag = getquake();
                await interaction.deferReply();
                if (max_scale == 10){
                    colorcode = 0x57F287
                } else if (max_scale == 20){
                    colorcode = 0x25BCFF
                } else if (max_scale == 30){
                    colorcode = 0xFEE75C
                } else if (max_scale == 40){
                    colorcode = 0xFF9006
                } else if (max_scale > 49 && max_scale < 60){
                    colorcode = 0xEB459E
                } else if (max_scale > 59 && max_scale < 70){
                    colorcode = 0x9B00FF
                } else if (max_scale == 70){
                    colorcode = 0xFF0000
                }
                setTimeout(async function() {
                
                await interaction.editReply({embeds: [{
                    title: `最新の地震情報`,
                    color: colorcode,
                    timestamp: new Date(),
                    footer: {
                      text: "この情報は気象庁のAPIを使用して取得しています。"
                    },
                    fields: [
                      {
                        name: "観測時刻",
                        value: time.toString()
                      },
                      {
                        name: "震源",
                        value: locate.toString()
                      },
                      {
                        name: "最大震度",
                        value: max_scale.toString().replace('55','5強').replace('50','5弱').replace('65','6強').replace('60','6弱').replace('0',''),
                        inline: true
                      },
                      {
                        name: "マグニチュード",
                        value: mag.toString(),
                      },
                    ]
                }]});
            
                }, 600);

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