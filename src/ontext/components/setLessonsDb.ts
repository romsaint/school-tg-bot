import TelegramBot from "node-telegram-bot-api";
import { setLessonsInDb } from "../..";
import { client } from "../../db/main";
import { setSchedule } from "./setSchedule";

export async function setLessonsDb(msg: TelegramBot.Message) {
    if (!msg.text) throw new Error('TEXT PLEASE')

    const schedule = msg.text?.split(',')
    const day = setLessonsInDb[msg.chat.id].day

    for (let i = 0; i < schedule.length; i++) {
        await client.query(`
                INSERT INTO lessons (user_id, lesson, lesson_time, day_of_week)
                VALUES ($1, $2, $3, $4)
            `, [msg.from?.id, schedule[i].trim(), 40, day]);
    }

    setSchedule(msg)
}