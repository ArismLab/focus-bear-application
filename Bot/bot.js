import { Telegraf, Markup } from "telegraf";
import dotenv from 'dotenv';
dotenv.config();

const TOKEN = import.meta.env.BOT_TOKEN;
const bot = new Telegraf(TOKEN,  { telegram: { testEnv: true }});

const web_link = "https://arismlab.github.io/focusbear/";

// bot.start((ctx) =>
//   ctx.reply("Launch App", {
//     reply_markup: {
//       keyboard: [[{ text: "web app", web_app: { url: web_link } }]],
//     },
//   })
// );

bot.start((ctx) => ctx.reply('Welcome'))


// TODO: 3 buttons here
bot.command("inlinekb", ctx =>
	ctx.reply(
		"Launch mini app from inline keyboard!",
        Markup.inlineKeyboard([Markup.button.webApp("Launch", web_link)]),
	),
);


bot.launch();