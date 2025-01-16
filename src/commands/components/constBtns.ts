import TelegramBot from "node-telegram-bot-api";
import { bot } from "../..";

export async function constBtns(msg: TelegramBot.Message, text: string) {
    await bot.sendMessage(msg.chat.id, text, {
        reply_markup: {
            keyboard: [
                [{text: 'Установить расписание'}],
                [{text: 'Расписание на неделю'}],
                [{text: "Сколько уроков прошло"}]
            ],
            resize_keyboard: true
        }
    })
}