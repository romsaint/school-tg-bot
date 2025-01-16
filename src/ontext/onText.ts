import TelegramBot from "node-telegram-bot-api";
import { bot, dayOfWeek, setLessonsAreCreated, setLessonsInDb, setLessonsState } from "..";
import { client } from "../db/main";
import { constBtns } from "../commands/components/constBtns";
import { setSchedule } from "./components/setSchedule";
import { Lessons } from "../db/entity/lessons.entity";
import { setLessonsDb } from "./components/setLessonsDb";
import { onBack } from "./components/onBack";
import { getStartLessons } from "../utils/getStartLessons";
import { scheduleOfWeek } from "./components/scheduleOfWeek";



export async function onText(msg: TelegramBot.Message) {
    try {
        const chatId = msg.chat.id
        const text = msg.text

        if (text === 'Назад') {
            onBack(msg)
        }
        if (setLessonsState[chatId] && text === 'Установить расписание') {
            await setSchedule(msg)
            return
        }

        if (setLessonsInDb[chatId]?.id) {
            await setLessonsDb(msg)
        }
        if (/*setLessonsAreCreated[chatId]  && */  text === 'Расписание на неделю') {
            await scheduleOfWeek(msg)
        }
    } catch (e) {
        if (e instanceof Error) {
            console.log(e.message)
            await bot.sendMessage(msg.chat.id, 'Ошибка на стороне сервера 😢')
        }
    }
}