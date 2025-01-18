import TelegramBot from "node-telegram-bot-api"
import { bot, sethomeworToDbState } from "../.."
import { client } from "../../db/main"
import { lessonsToChoose } from "../../utils/lessonsToChoose"

export async function setHomeworkToDb(msg: TelegramBot.Message, text: string) {
    const chatId = msg.chat.id
    const id = parseInt(sethomeworToDbState[chatId].id)
    await client.query(`
                update lessons
                set homework = $1
                where id = $2  
            `, [text, id])
    const day = (await client.query(`
                SELECT day_of_week FROM lessons
                WHERE id = $1   
            `, [id])).rows

    if (day.length === 0) throw new Error()
     
    const keyboard = await lessonsToChoose(msg, day[0].day_of_week)
    if (keyboard) {
        await bot.sendMessage(chatId, 'Домашнее задание успешно установленно!', {
            reply_markup: {
                inline_keyboard: keyboard
            }
        })
    } else {
        await bot.sendMessage(chatId, 'Все уроки заполненны домашним заданием', {
            reply_markup: {
                keyboard: [[{ text: 'Назад' }]],
                resize_keyboard: true
            }
        })
    }
}