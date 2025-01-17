import TelegramBot from "node-telegram-bot-api"
import { backChooseLessonState, bot, setLessonsInDb } from "../.."
import { constBtns } from "../../commands/components/constBtns"
import { setHomework } from "./setHomework"

export async function onBack(msg: TelegramBot.Message) {
    try{
        if(backChooseLessonState[msg.chat.id]) {
            setHomework(msg)
            return
        }

        setLessonsInDb[msg.chat.id] = { day: '', id: null }
        constBtns(msg, 'Главное меню')
        return
    }catch(e) {
        if (e instanceof Error) {
            console.log(e.message)
            await bot.sendMessage(msg.chat.id, 'Ошибка на стороне сервера :(')
        }
    }
}