import TelegramBot from "node-telegram-bot-api";
import { client } from "../../db/main";
import { backChooseLessonState, bot, chooseLessonState } from "../..";

export async function setDayHomework(msg: TelegramBot.Message) {
    const days = (await client.query(`
        SELECT DISTINCT day_of_week FROM lessons
        WHERE user_id = $1 AND homework is null
        ORDER BY day_of_week;          
    `, [msg.from?.id])).rows
    backChooseLessonState[msg.chat.id] = ''

    //  0 1 2 3 4 5
    if (days.length > 0) {
        let keyboard: { text: string }[][] = [[], [], []]

        for (let i = 0; i < days.length; i++) {
            const day = days[i].day_of_week; // Получаем день недели
    
            // Распределяем дни по строкам клавиатуры
            if (i < 2) {
                keyboard[0].push({ text: day }); // Первые два дня в первую строку
            } else if (i < 4) {
                keyboard[1].push({ text: day }); // Следующие два дня во вторую строку
            } else {
                keyboard[2].push({ text: day }); // Остальные дни в третью строку
            }
        }
        keyboard = keyboard

        keyboard.push([{text: "Назад"}])

        chooseLessonState[msg.chat.id] = 'ready'
        await bot.sendMessage(msg.chat.id, "Выберите день недели", {
            reply_markup: {
                keyboard: keyboard,
                resize_keyboard: true
            }
        })
    } else {
        await bot.sendMessage(msg.chat.id, "У вас нет расписания уроков")
    }
}