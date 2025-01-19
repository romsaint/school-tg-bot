import TelegramBot from "node-telegram-bot-api"
import { Lessons } from "../../db/entity/lessons.entity"
import { client } from "../../db/main"
import { bot, dayOfWeek, setLessonsAreCreated, setLessonsInDb } from "../.."



export async function setSchedule(msg: TelegramBot.Message) {
    const chatId = msg.chat.id

    const lessons: Lessons[] = (await client.query(`
        SELECT * FROM lessons
        WHERE user_id = $1
    `, [msg.from?.id])).rows
        
    if (lessons.length === 0) {
        await bot.sendMessage(chatId, `Пришлите расписание уроков на <b>Понедельник</b>, разделённых <b>запятой</b> (Пример: русский, химия, физика ...)`, {
            parse_mode: "HTML",
            reply_markup: {
                keyboard: [
                    [{text: "Назад"}]
                ],
                resize_keyboard: true
            }
        })
        setLessonsInDb[chatId] = { id: chatId, day: 'Понедельник' }
    } else {
        let idx = dayOfWeek.findIndex(val => val === lessons[lessons.length - 1].day_of_week as unknown as string) + 1

        if (dayOfWeek[idx] === 'Суббота') {
            setLessonsAreCreated[chatId] = 'ready'
            await bot.sendMessage(chatId, `Пришлите расписание уроков на <b>Субботу</b>, разделённых <b>запятой.</b> Если вы не учитесь по субботам, то нажмите <b>назад</b>`, {
                parse_mode: "HTML",
                reply_markup: {
                    keyboard: [
                        [{text: "Назад"}],
                    ],
                    resize_keyboard: true
                }
            })
            setLessonsInDb[chatId] = { id: chatId, day: dayOfWeek[idx] }
        }
        else{
            setLessonsAreCreated[chatId] = 'ready'
            await bot.sendMessage(chatId, `Пришлите расписание уроков на <b>${dayOfWeek[idx] === 'Среда' || dayOfWeek[idx] === 'Пятница' ? dayOfWeek[idx].slice(0, dayOfWeek[idx].length - 1) + 'у' : dayOfWeek[idx]}</b>, разделённых <b>запятой.</b>`, {
                parse_mode: "HTML",
                reply_markup: {
                    keyboard: [
                        [{text: "Назад"}],
                    ],
                    resize_keyboard: true
                }
            })
            setLessonsInDb[chatId] = { id: chatId, day: dayOfWeek[idx] }
        }

    }
}