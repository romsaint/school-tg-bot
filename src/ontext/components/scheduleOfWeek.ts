import TelegramBot from "node-telegram-bot-api";
import { bot } from "../..";
import { client } from "../../db/main";
import { Lessons } from "../../db/entity/lessons.entity";
import { onBack } from "./onBack";
import { getStartLessons } from "../../utils/getStartLessons";

export async function scheduleOfWeek(msg: TelegramBot.Message) {
    const chatId = msg.chat.id

    const schedule: Lessons[] = (await client.query(`
        SELECT * FROM lessons
        WHERE user_id = $1
        ORDER BY day_of_week 
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
        const scheduleOfDay = `Расписание на ${dayOfWeek === 'Среда' || dayOfWeek === 'Пятница' || dayOfWeek === 'Суббота' ? dayOfWeek.slice(0, dayOfWeek.length - 1) + 'у' : dayOfWeek}`.toUpperCase();
        let scheduleText = `\`\`\`\n📅${scheduleOfDay}\n\`\`\`\n`;

        const date = await getStartLessons(); // Начальное время уроков
        let d = new Date(date); // Время начала первого урока

        for (let i = 0; i < lessons.length; i++) {
            const d2 = new Date(d.getTime() + lessons[0].lesson_time * 60000);
            let timeStart = d.toLocaleTimeString().slice(0, 5);
            let lessonName = lessons[i].lesson.toUpperCase()
            let timeEnd = d2.toLocaleTimeString().slice(0, 5)

            if (i === 1 || i === 2) {
                // Уроки с 20-минутной переменой
                scheduleText += `\`\`\`${i + 1}. ${lessonName}${!lessons[i].homework ? ' - Не задано' :` - ${lessons[i].homework}` }\`\`\`\n🕒 С ${timeStart} - ${timeEnd}, перемена ${20} минут\n`;
                d.setMinutes(d.getMinutes() + lessons[i].lesson_time + 20); // Урок + перемена
            } else if (i === 3) {
                // Урок с 10-минутной переменой и столовой
                scheduleText += `\`\`\`${i + 1}. ${lessonName}${!lessons[i].homework ? ' - Не задано' :` - ${lessons[i].homework}` }\`\`\`\n🕒 С ${timeStart} - ${timeEnd}, перемена ${10} минут\n🍽 После этого урока *столовая*\n`;
                d.setMinutes(d.getMinutes() + lessons[i].lesson_time + 10); // Урок + перемена
            } else {
                // Остальные уроки с 10-минутной переменой
                scheduleText += `\`\`\`${i + 1}. ${lessonName}${!lessons[i].homework ? ' - Не задано' :` - ${lessons[i].homework}` }\`\`\`\n🕒 С ${timeStart} - ${timeEnd}, перемена ${10} минут\n`;
                d.setMinutes(d.getMinutes() + lessons[i].lesson_time + 10); // Урок + перемена
            }
        }

        await bot.sendMessage(chatId, dayOfWeek);
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