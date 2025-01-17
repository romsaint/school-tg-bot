import TelegramBot from "node-telegram-bot-api";
import { backChooseLessonState, bot, chooseLessonState, dayOfWeek, setHomeworkState, setLessonsAreCreated, setLessonsInDb, setLessonsState } from "..";
import { setSchedule } from "./components/setSchedule";
import { setLessonsDb } from "./components/setLessonsDb";
import { onBack } from "./components/onBack";
import { scheduleOfWeek } from "./components/scheduleOfWeek";
import { setHomework } from "./components/setHomework";
import { saveHomeworkToDb } from "./components/saveHomeworkToDb";
import { Lessons } from "../db/entity/lessons.entity";
import { client } from "../db/main";



export async function onText(msg: TelegramBot.Message) {
    try {
        const chatId = msg.chat.id
        const text = msg.text
        if (!text) throw new Error('TEXT err')

        if (text === 'Назад') {
            onBack(msg)
        }
        if (setLessonsState[chatId] && text === 'Установить расписание') {
            await setSchedule(msg)
            return
        }
        if (dayOfWeek.includes(text) && chooseLessonState[chatId]) {
            const lessons: Lessons[] = (await client.query(`
                SELECT lesson FROM lessons
                WHERE user_id = $1 AND day_of_week = $2           
            `, [msg.from?.id, text])).rows

            chooseLessonState[msg.chat.id] = ''

            if (lessons.length > 0) {
                let keyboard = []
                for (let i = 0; i < lessons.length; i++) {
                    keyboard.push({ text: lessons[i].lesson as unknown as string })
                }
                keyboard = [keyboard]
                keyboard.push([{ text: "Назад" }])
                backChooseLessonState[chatId] = 'ready'

                await bot.sendMessage(chatId, 'Выберите урок', {
                    reply_markup: {
                        keyboard: keyboard,

                        resize_keyboard: true
                    }
                })
            } else {
                await bot.sendMessage(msg.chat.id, "У вас нет расписания уроков")
            }
            return
        }
        if (setLessonsInDb[chatId]?.id) {
            await setLessonsDb(msg)
        }
        if (text === 'Расписание на неделю') {
            await scheduleOfWeek(msg)
        }
        if (text === 'Установить домашнее задание') {
            setHomework(msg)
        }
    } catch (e) {
        if (e instanceof Error) {
            console.log(e.message)
            await bot.sendMessage(msg.chat.id, 'Ошибка на стороне сервера 😢')
        }
    }
}