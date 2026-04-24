const { Telegraf } = require('telegraf');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const http = require('http');

const botToken = process.env.BOT_TOKEN;
const geminiApiKey = process.env.GEMINI_API_KEY;
const allowedChatId = '-1003978676908'; 

const bot = new Telegraf(botToken);
const genAI = new GoogleGenerativeAI(geminiApiKey);

http.createServer((req, res) => {
    res.write('Sajjad AI is Online!');
    res.end();
}).listen(process.env.PORT || 3000);

bot.on('text', async (ctx) => {
    if (ctx.chat.id.toString() !== allowedChatId) return;

    try {
        // এখানে আমি লেটেস্ট মডেল 'gemini-1.5-flash' দিচ্ছি
        // যা দ্রুত এবং v1beta এরর দেয় না
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const result = await model.generateContent(ctx.message.text);
        const response = await result.response;
        await ctx.reply(response.text());
    } catch (error) {
        console.error("Full Error:", error);
        
        // যদি ফ্ল্যাশেও এরর দেয়, তবে এইটা 'gemini-1.5-pro' ট্রাই করবে
        try {
            const backupModel = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
            const result = await backupModel.generateContent(ctx.message.text);
            await ctx.reply(result.response.text());
        } catch (err) {
            ctx.reply(`এখনো মডেল খুঁজে পাচ্ছে না। এরর: ${err.message}`);
        }
    }
});

bot.launch().then(() => console.log("Sajjad AI Active!"));
