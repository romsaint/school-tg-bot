import TelegramBot from "node-telegram-bot-api";
import { bot, startBtns } from "../..";

export async function constBtns(msg: TelegramBot.Message, text: string) {
    const keyboard: {text: string}[][] = []
    startBtns.forEach((val, idx) => {
        keyboard.push([{text: val}])
    })
    await bot.sendMessage(msg.chat.id, text, {
        reply_markup: {
            keyboard: keyboard,
            resize_keyboard: true
        },
        parse_mode: "Markdown"
    })
}