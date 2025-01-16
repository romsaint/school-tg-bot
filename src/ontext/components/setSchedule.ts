import TelegramBot from "node-telegram-bot-api"
import { Lessons } from "../../db/entity/lessons.entity"
import { client } from "../../db/main"
import { bot, dayOfWeek, setLessonsCreatedState, setLessonsInDb } from "../.."

export async function setSchedule(msg: TelegramBot.Message) {
    const chatId = msg.chat.id

    const lessons: Lessons[] = (await client.query(`
        SELECT * FROM lessons
        WHERE user_id = $1
    `, [msg.from?.id])).rows
  
    if (lessons.length === 0) {
        await bot.sendMessage(chatId, `Пришлите расписание уроков на <b>Понедельник</b>, разделённых <b>запятой</b> (Пример: понедельник,вторник, среда ...)`, { 
            parse_mode: "HTML"
        })
        setLessonsInDb[chatId] = {id: chatId, day: 'Понедельник'}
    }else{
        let idx = dayOfWeek.findIndex(val => val === lessons[lessons.length - 1].day_of_week as unknown as string) + 1
        dayOfWeek[idx] === 'Суббота' ? setLessonsCreatedState[chatId] = 'ready' : ''
        
        await bot.sendMessage(chatId, `Пришлите расписание уроков на <b>${dayOfWeek[idx]}</b>, разделённых <b>запятой.</b>`, { 
            parse_mode: "HTML",
            reply_markup: {keyboard: [[{text: dayOfWeek[idx] === 'Суббота' ?  "Назад" : ''}]], resize_keyboard: true}
        })
        setLessonsInDb[chatId] = {id: chatId, day: dayOfWeek[idx]}
    }
}