import TelegramBot from "node-telegram-bot-api"
import { bot, homeworkOnLessonState, sethomeworToDbState } from "../.."
import { setDayHomework } from "../../ontext/components/setDayHomework"

export async function onCbQuery(query: TelegramBot.CallbackQuery) {
    if(homeworkOnLessonState[query.from.id] && query.data) {
        await bot.sendMessage(query.from.id, 'Напишите домашнее задание', {
            reply_markup: {
                keyboard: [[{text: 'Назад'}]],
                resize_keyboard: true
            }
        })
        sethomeworToDbState[query.from.id] = {id: query.data, ready: 'ready'}
    }
}