const { Telegraf } = require('telegraf');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const http = require('http');

// এখানে সরাসরি কি না লিখে process.env ব্যবহার করছি
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
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 
        const result = await model.generateContent(ctx.message.text);
        const response = await result.response;
        await ctx.reply(response.text());
    } catch (error) {
        console.error("Error:", error);
        ctx.reply(`এরর: ${error.message}`);
    }
});

bot.launch();
