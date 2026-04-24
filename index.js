const { Telegraf } = require('telegraf');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const http = require('http');

const botToken = '8594482963:AAHpyR86Appr0xtli024TzoBC1SSGGaEk_o';
const geminiApiKey = 'AIzaSyDN4C5ywIw357tn8mBCooG_bw-VPQrouiE';
const allowedChatId = '-1003978676908'; // আপনার দেওয়া চ্যাট আইডি

const bot = new Telegraf(botToken);
const genAI = new GoogleGenerativeAI(geminiApiKey);

http.createServer((req, res) => {
    res.write('Sajjad AI is Live!');
    res.end();
}).listen(process.env.PORT || 3000);

bot.start((ctx) => ctx.reply('সাজ্জাদ ভাই, আমি আপনার AI সহকারী।'));

bot.on('text', async (ctx) => {
    // চ্যাট আইডি চেক করা হচ্ছে
    if (ctx.chat.id.toString() !== allowedChatId) {
        return; // আইডি না মিললে কোনো উত্তর দেবে না
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 
        const result = await model.generateContent(ctx.message.text);
        const response = await result.response;
        await ctx.reply(response.text());
    } catch (error) {
        console.error("Gemini Error:", error);
        ctx.reply(`সমস্যা: ${error.message}`);
    }
});

bot.launch().then(() => console.log("Bot running on protected chat ID..."));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
