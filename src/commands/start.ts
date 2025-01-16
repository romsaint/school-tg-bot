import TelegramBot from "node-telegram-bot-api";
import { bot, dayOfWeek, setLessonsState } from "..";
import { constBtns } from "./components/constBtns";
import { client } from "../db/main";
import { Lessons } from "../db/entity/lessons.entity";
import { getStartLessons } from "../utils/getStartLessons";

export async function startCommand(msg: TelegramBot.Message) {
    try {
        const chatId = msg.chat.id
        const text = `Это бот, который поможет вам с расписанием уроков. Он будет напоминать, когда какой урок и когда перемена. `
        setLessonsState[chatId] = 'ready'

        const dayIdx = new Date().getDay() - 1;
        const day = dayOfWeek[dayIdx];

        const lessons: Lessons[] = (await client.query(`
            SELECT * FROM lessons
            WHERE user_id = $1 AND day_of_week = $2
        `, [msg.from?.id, day])).rows;

        if (lessons.length > 0) {
            const date = await getStartLessons();
            let d = new Date(date);
            let d2 = new Date(date);

            let scheduleText = `\`\`\`\n📅Уроки на сегодня\n\`\`\`\n`;

            for (let i = 0; i < lessons.length; i++) {
                if (i === 1 || i === 2) {
                    scheduleText += `\`\`\`${i + 1}. ${lessons[i].lesson.toUpperCase()}\`\`\`\n🕒 С ${d.toLocaleTimeString().slice(0, 5)} - ${new Date(d2.setMinutes(d.getMinutes() + 40)).toLocaleTimeString().slice(0, 5)}, перемена ${20} минут\n`;
                    d.setMinutes(d.getMinutes() + 40 + 20);
                } else if (i === 3) {
                    scheduleText += `\`\`\`${i + 1}. ${lessons[i].lesson.toUpperCase()}\`\`\`\n🕒 С ${d.toLocaleTimeString().slice(0, 5)} - ${new Date(d2.setMinutes(d.getMinutes() + 40)).toLocaleTimeString().slice(0, 5)}, перемена ${10} минут\n🍽 После этого урока *столовая*\n`;
                    d.setMinutes(d.getMinutes() + 40 + 10);
                } else {
                    scheduleText += `\`\`\`${i + 1}. ${lessons[i].lesson.toUpperCase()}\`\`\`\n🕒 С ${d.toLocaleTimeString().slice(0, 5)} - ${new Date(d2.setMinutes(d.getMinutes() + 40)).toLocaleTimeString().slice(0, 5)}, перемена ${10} минут\n`;
                    d.setMinutes(d.getMinutes() + 40 + 10);
                }
            }

            constBtns(msg, text)
            await bot.sendMessage(chatId, scheduleText, {
                parse_mode: "Markdown"
            })
        } else {
            constBtns(msg, text)
        }
    } catch (e) {
        if (e instanceof Error) {
            console.log(e.message)
            await bot.sendMessage(msg.chat.id, 'Ошибка на стороне сервера 😢')
        }
    }
}