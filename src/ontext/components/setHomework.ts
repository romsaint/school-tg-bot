import TelegramBot from "node-telegram-bot-api";
import { Lessons } from "../../db/entity/lessons.entity";
import { client } from "../../db/main";
import { bot, chooseLessonState } from "../..";

export async function setHomework(msg: TelegramBot.Message) {
    const days: Lessons[] = (await client.query(`
        SELECT DISTINCT day_of_week FROM lessons
        WHERE user_id = $1                
    `, [msg.from?.id])).rows

    if(days.length > 0 ) {
        let keyboard = []
        for(let i = 0; i < days.length; i++) {
            keyboard.push({text: days[i].day_of_week as unknown as string})
        }
        keyboard = [keyboard]
        keyboard.push([{text: "Назад"}])

        chooseLessonState[msg.chat.id] = 'ready'
        await bot.sendMessage(msg.chat.id, "Выбери день недели", {
            reply_markup: {
                keyboard: keyboard,

                resize_keyboard: true
            }
        })
    }else{
        await bot.sendMessage(msg.chat.id, "У вас нет расписания уроков")
    }
}