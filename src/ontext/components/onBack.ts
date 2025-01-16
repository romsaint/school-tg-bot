import TelegramBot from "node-telegram-bot-api"
import { bot, setLessonsInDb } from "../.."
import { constBtns } from "../../commands/components/constBtns"

export async function onBack(msg: TelegramBot.Message) {
    try{
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