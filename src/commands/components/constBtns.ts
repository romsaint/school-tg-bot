import TelegramBot from "node-telegram-bot-api";
import { bot, startBtns } from "../..";

export async function constBtns(msg: TelegramBot.Message, text: string) {
    await bot.sendMessage(msg.chat.id, text, {
        reply_markup: {
            keyboard: [
                [{text: startBtns[0]}],
                [{text: startBtns[1]}],
                [{text: startBtns[2]}],
            ],
            resize_keyboard: true
        }
    })
}