import TelegramBot from "node-telegram-bot-api";
import { backChooseLessonState, bot, chooseLessonState, homeworkOnLessonState } from "../..";
import { lessonsToChoose } from "../../utils/lessonsToChoose";

export async function chooseLesson(msg: TelegramBot.Message, text: string) {
    const chatId = msg.chat.id
    chooseLessonState[msg.chat.id] = ''

    const keyboard = await lessonsToChoose(msg, text)
    
    if(keyboard){
        backChooseLessonState[chatId] = 'ready'
        homeworkOnLessonState[chatId] = 'ready'
    
        await bot.sendMessage(chatId, 'Выберите урок', {
            reply_markup: {
                inline_keyboard: keyboard
            }
        })
    } else {
        chooseLessonState[msg.chat.id] = 'ready'
        await bot.sendMessage(msg.chat.id, "Все уроки заполненны домашним заданием")
    }
    
    return
}