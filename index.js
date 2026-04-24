const { Telegraf } = require('telegraf');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// কনফিগারেশন
const botToken = '8594482963:AAHpyR86Appr0xtli024TzoBC1SSGGaEk_o';
const geminiApiKey = 'AIzaSyDN4C5ywIw357tn8mBCooG_bw-VPQrouiE';
const chatId = '-1003978676908';

const bot = new Telegraf(botToken);
const genAI = new GoogleGenerativeAI(geminiApiKey);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

bot.start((ctx) => {
    ctx.reply('সাজ্জাদ ভাই, আপনার AI বট এখন প্রস্তুত! আপনি কিছু জিজ্ঞেস করতে পারেন।');
});

bot.on('text', async (ctx) => {
    // শুধু নির্দিষ্ট চ্যাট আইডিতে কাজ করার জন্য (ঐচ্ছিক)
    // if (ctx.chat.id.toString() !== chatId) return;

    try {
        const prompt = ctx.message.text;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        await ctx.reply(text);
    } catch (error) {
        console.error("Error:", error);
        ctx.reply('দুঃখিত ভাই, কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    }
});

bot.launch().then(() => {
    console.log("Sajjad AI Bot is running...");
});

// প্রোসেস বন্ধ করার হ্যান্ডলার
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
