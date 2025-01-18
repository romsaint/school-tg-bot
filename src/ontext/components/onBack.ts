import TelegramBot from "node-telegram-bot-api"
import { backChooseLessonState, bot, chooseLessonState, homeworkOnLessonState, sethomeworToDbState, setLessonsAreCreated, setLessonsInDb } from "../.."
import { constBtns } from "../../commands/components/constBtns"
import { setDayHomework } from "./setDayHomework"

export async function onBack(msg: TelegramBot.Message) {
    const chatId = msg.chat.id
    try {
        setLessonsInDb[chatId] = { day: '', id: null }
        chooseLessonState[chatId] = ''
        setLessonsAreCreated[chatId] = ''
        homeworkOnLessonState[chatId] = ''
        sethomeworToDbState[chatId] = { ready: '', id: '' }
        backChooseLessonState[chatId] = ''

        if (backChooseLessonState[chatId]) {
            setDayHomework(msg)
            return
        }

        constBtns(msg, 'Главное меню')
        return
    } catch (e) {
        if (e instanceof Error) {
            console.log(e.message)
            await bot.sendMessage(msg.chat.id, 'Ошибка на стороне сервера :(')
        }
    }
}