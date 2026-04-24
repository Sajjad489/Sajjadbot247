const { Telegraf } = require('telegraf');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const http = require('http');

// Render Environment Variables
const botToken = process.env.BOT_TOKEN;
const geminiApiKey = process.env.GEMINI_API_KEY;
const allowedChatId = '-1003978676908'; 

const bot = new Telegraf(botToken);
const genAI = new GoogleGenerativeAI(geminiApiKey);

// সিম্পল সার্ভার (Render keep-alive)
http.createServer((req, res) => {
    res.write('Sajjad AI is Online!');
    res.end();
}).listen(process.env.PORT || 3000);

bot.on('text', async (ctx) => {
    // চ্যাট আইডি চেক
    if (ctx.chat.id.toString() !== allowedChatId) return;

    try {
        // মডেলের নামটা 'gemini-pro' দিয়ে ট্রাই করি, এটা সব ভার্সনে স্টেবল
        const model = genAI.getGenerativeModel({ model: "gemini-pro" }); 
        
        const result = await model.generateContent(ctx.message.text);
        const response = await result.response;
        const text = response.text();
        
        await ctx.reply(text);
    } catch (error) {
        console.error("Detailed Error:", error);
        ctx.reply(`দুঃখিত, সমস্যা হচ্ছে: ${error.message}`);
    }
});

bot.launch().then(() => console.log("Bot is running..."));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
