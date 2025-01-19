import TelegramBot from "node-telegram-bot-api";
import { bot, chooseLessonState, dayOfWeek, sethomeworToDbState, setLessonsInDb } from "..";
import { setSchedule } from "./components/setSchedule";
import { setLessonsDb } from "./components/setLessonsDb";
import { onBack } from "./components/onBack";
import { scheduleOfWeek } from "./components/scheduleOfWeek";
import { setDayHomework } from "./components/setDayHomework";
import { chooseLesson } from "./components/chooseLesson";
import { setHomeworkToDb } from "./components/setHomeworrkToDb";



export async function onText(msg: TelegramBot.Message) {
    try {
        const chatId = msg.chat.id
        const text = msg.text
        if (!text) throw new Error('TEXT err')

        if (text === 'Назад') {
            onBack(msg)
            return
        }
        if (text === 'Установить расписание') {
            await setSchedule(msg)
            return
        }
        if (sethomeworToDbState[chatId]?.ready) {
            setHomeworkToDb(msg, text)
            return
        }
        if (dayOfWeek.includes(text) && chooseLessonState[chatId]) {
            chooseLesson(msg, text)
        }
        if (setLessonsInDb[chatId]?.id) {
            await setLessonsDb(msg)
        }
        if (text === 'Расписание на неделю') {
            await scheduleOfWeek(msg)
        }
        if (text === 'Установить домашнее задание') {
            setDayHomework(msg)
        }
    } catch (e) {
        if (e instanceof Error) {
            console.log(e.message)
            await bot.sendMessage(msg.chat.id, 'Ошибка на стороне сервера 😢')
        }
    }
}