const { Telegraf } = require('telegraf');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const http = require('http');

const botToken = '8594482963:AAHpyR86Appr0xtli024TzoBC1SSGGaEk_o';
const geminiApiKey = 'AIzaSyDN4C5ywIw357tn8mBCooG_bw-VPQrouiE';

const bot = new Telegraf(botToken);
const genAI = new GoogleGenerativeAI(geminiApiKey);

// রেন্ডার সার্ভার
http.createServer((req, res) => {
    res.write('Sajjad AI is Online!');
    res.end();
}).listen(process.env.PORT || 3000);

bot.on('text', async (ctx) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 
        const result = await model.generateContent(ctx.message.text);
        const response = await result.response;
        await ctx.reply(response.text());
    } catch (error) {
        console.error("Error Details:", error);
        ctx.reply("দুঃখিত, কিছু একটা ভুল হয়েছে।");
    }
});

bot.launch().then(() => console.log("Bot Started..."));
