import TelegramBot from "node-telegram-bot-api";
import { setLessonsState } from "..";
import { constBtns } from "./components/constBtns";

export async function startCommand(msg: TelegramBot.Message) {
    const chatId = msg.chat.id
    const text = `Это бот, который поможет вам с расписанием уроков. Он будет напоминать, когда какой урок и когда перемена. `
    setLessonsState[chatId] = 'ready'
    constBtns(msg, text)
}