import TelegramBot from "node-telegram-bot-api";
import { dayOfWeek, setLessonsInDb } from "../..";
import { client } from "../../db/main";
import { setSchedule } from "./setSchedule";
import { constBtns } from "../../commands/components/constBtns";

export async function setLessonsDb(msg: TelegramBot.Message) {
    if (!msg.text) throw new Error('TEXT PLEASE')

    const schedule = msg.text?.split(',')
    const day = setLessonsInDb[msg.chat.id].day

    for (let i = 0; i < schedule.length; i++) {
        if(schedule[i].trim()) {
            await client.query(`
                INSERT INTO lessons (user_id, lesson, lesson_time, day_of_week)
                VALUES ($1, $2, $3, $4)
            `, [msg.from?.id, schedule[i].trim(), 40, day]);
        }
    }
    if(day === dayOfWeek[5]) {
        await constBtns(msg, 'Вы успешно заполни все дни недели!')
    }else{
        setSchedule(msg)
    }
}