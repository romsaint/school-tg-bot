import TelegramBot from "node-telegram-bot-api";
import { bot, dayOfWeek, setLessonsCreatedState, setLessonsInDb, setLessonsState } from "..";
import { client } from "../db/main";
import { constBtns } from "../commands/components/constBtns";
import { setSchedule } from "./components/setSchedule";
import { Lessons } from "../db/entity/lessons.entity";
import { setLessonsDb } from "./components/setLessonsDb";
import { onBack } from "./components/onBack";
import { getStartLessons } from "../utils/getStartLessons";



export async function onText(msg: TelegramBot.Message) {
    try {
        const chatId = msg.chat.id
        const text = msg.text

        if (text === 'Назад') {
            onBack(msg)
        }
        if (setLessonsState[chatId] && text === 'Установить расписание') {
            setSchedule(msg)
        }

        if (setLessonsInDb[chatId]?.id && setLessonsInDb[chatId]?.day !== dayOfWeek[5]) {
            setLessonsDb(msg)
        }
        if (/*setLessonsCreatedState[chatId] && */text === 'Расписание на неделю') {
            const dayIdx = new Date().getDay() - 1;
            const day = dayOfWeek[dayIdx];

            // Получаем все уроки для пользователя
            const schedule: Lessons[] = (await client.query(`
                SELECT * FROM lessons
                WHERE user_id = $1
            `, [msg.from?.id])).rows;

            // Группируем уроки по дням недели
            const groupedSchedule: { [key: string]: Lessons[] } = {};

            for (const lesson of schedule) {
                const day = lesson.day_of_week; // Получаем день недели
                if (!groupedSchedule[day]) {
                    groupedSchedule[day] = []; // Создаем массив для этого дня, если его еще нет
                }
                groupedSchedule[day].push(lesson); // Добавляем урок в соответствующий день
            }


            if (schedule.length === 0) {
                await bot.sendMessage(chatId, 'На сегодня у вас нет уроков');
                onBack(msg);
                return;
            }


            for (const dayOfWeek in groupedSchedule) {
                const lessons = groupedSchedule[dayOfWeek]; // Уроки для текущего дня недели
                const scheduleOfDay = `Расписание на ${dayOfWeek}`.toUpperCase()
                let scheduleText = `\`\`\`\n📅${scheduleOfDay}\n\`\`\`\n`;

                const date = await getStartLessons();
                let d = new Date(date);
                let d2 = new Date(date);

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

                await bot.sendMessage(chatId, dayOfWeek)
                await bot.sendMessage(chatId, scheduleText, {
                    parse_mode: 'Markdown', // Используем MarkdownV1
                    reply_markup: {
                        keyboard: [
                            [{ text: "Назад" }]
                        ],
                        resize_keyboard: true
                    }
                });
            }

        }
    } catch (e) {
        if (e instanceof Error) {
            console.log(e.message)
            await bot.sendMessage(msg.chat.id, 'Ошибка на стороне сервера :(')
        }
    }
}