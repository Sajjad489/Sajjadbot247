const { Telegraf } = require('telegraf');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const http = require('http'); // লোকাল সার্ভারের জন্য

// কনফিগারেশন
const botToken = '8594482963:AAHpyR86Appr0xtli024TzoBC1SSGGaEk_o';
const geminiApiKey = 'AIzaSyDN4C5ywIw357tn8mBCooG_bw-VPQrouiE';

const bot = new Telegraf(botToken);
const genAI = new GoogleGenerativeAI(geminiApiKey);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// রেন্ডারের জন্য সিম্পল সার্ভার (যাতে সার্ভিস অফ না হয়)
http.createServer((req, res) => {
    res.write('Bot is Running!');
    res.end();
}).listen(process.env.PORT || 3000);

bot.start((ctx) => ctx.reply('সাজ্জাদ ভাই, আপনার AI বট এখন প্রস্তুত!'));

bot.on('text', async (ctx) => {
    try {
        const result = await model.generateContent(ctx.message.text);
        const response = await result.response;
        await ctx.reply(response.text());
    } catch (error) {
        console.error("Error:", error);
        ctx.reply('কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    }
});

bot.launch();
console.log("Bot is alive...");
