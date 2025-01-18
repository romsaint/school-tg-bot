import TelegramBot from "node-telegram-bot-api";
import { client } from "../db/main";

export async function lessonsToChoose(msg: TelegramBot.Message, dayOfWeek: string): Promise<null | { text: string, callback_data: string }[][]> {
    const lessons = (await client.query(`
        SELECT lesson, id FROM lessons
        WHERE user_id = $1 AND day_of_week = $2 AND homework IS NULL
    `, [msg.from?.id, dayOfWeek])).rows

    if (lessons.length > 0) {
        let keyboard: { text: string, callback_data: string }[][] = [[], [], []]

        for (let i = 0; i < lessons.length; i++) {
            const lesson = lessons[i].lesson

            // Распределяем дни по строкам клавиатуры
            if (i < 2) {
                keyboard[0].push({ text: lesson, callback_data: lessons[i].id.toString() }); // Первые два дня в первую строку
            } else if (i < 4) {
                keyboard[1].push({ text: lesson, callback_data: lessons[i].id.toString() }); // Следующие два дня во вторую строку
            } else {
                keyboard[2].push({ text: lesson, callback_data: lessons[i].id.toString() }); // Остальные дни в третью строку
            }
        }

        return keyboard
    }

    return null
}