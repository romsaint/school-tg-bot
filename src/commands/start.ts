import TelegramBot from "node-telegram-bot-api";
import { bot, dayOfWeek } from "..";
import { constBtns } from "./components/constBtns";
import { client } from "../db/main";
import { Lessons } from "../db/entity/lessons.entity";
import { getStartLessons } from "../utils/getStartLessons";

export async function startCommand(msg: TelegramBot.Message) {
    try {
        const chatId = msg.chat.id
        const text = `Это бот, который поможет вам с расписанием уроков. Он будет напоминать, когда какой урок и когда перемена. `

        const dayIdx = /* new Date().getDay() - 1*/ 1;
        const day = dayOfWeek[dayIdx];

        const lessons: Lessons[] = (await client.query(`
            SELECT * FROM lessons
            WHERE user_id = $1 AND day_of_week = $2
        `, [msg.from?.id, day])).rows;

        if (lessons.length > 0) {
            const date = await getStartLessons();
            let d = new Date(date);
            let dateNow = new Date(); // Текущее время

            let scheduleText = `\`\`\`\n📅 Уроки на сегодня\n\`\`\``;

            let currentLesson = null; // Текущий урок
            let nextLesson = null; // Следующий урок
            let remainingTime = ''; // Оставшееся время

            for (let i = 0; i < lessons.length; i++) {
                const d2 = new Date(d.getTime() + lessons[i].lesson_time * 60000); // Время окончания урока
                let timeStart = d.toLocaleTimeString().slice(0, 5); // Время начала урока
                let timeEnd = d2.toLocaleTimeString().slice(0, 5); // Время окончания урока
                let lesson = lessons[i].lesson.toUpperCase(); // Название урока

                let [hours, minutes] = timeStart.split(':').map(Number);
                let dateStart = new Date();
                dateStart.setHours(hours);
                dateStart.setMinutes(minutes);

                let [endHours, endMinutes] = timeEnd.split(':').map(Number);
                let dateEnd = new Date();
                dateEnd.setHours(endHours);
                dateEnd.setMinutes(endMinutes);

                // Проверяем, идет ли сейчас этот урок
                if (dateNow >= dateStart && dateNow <= dateEnd) {
                    currentLesson = lesson;
                    let diffInMilliseconds = dateEnd.getTime() - dateNow.getTime(); // Оставшееся время урока
                    console.log(diffInMilliseconds, lesson, i)
                    let diffInMinutes = Math.floor(diffInMilliseconds / 60000); // Переводим в минуты
                    remainingTime = `⏳ Осталось ${diffInMinutes} минут до конца ${currentLesson}`;

                    // Если есть следующий урок, добавляем его в текст
                    if (i < lessons.length - 1) {
                        nextLesson = lessons[i + 1].lesson.toUpperCase();
                    }
                }

                // Формируем расписание
                if (i === 1 || i === 2) {
                    scheduleText += `\`\`\`${i + 1}. ${lesson}, домашнее задание: ${lessons[i].homework}\`\`\`\n🕒 С ${timeStart} - ${timeEnd}, \`перемена ${20} минут\`\n`;
                    d.setMinutes(d.getMinutes() + lessons[i].lesson_time + 20); // Урок + перемена
                } else if (i === 3) {
                    scheduleText += `\`\`\`${i + 1}. ${lesson}, домашнее задание: ${lessons[i].homework}\`\`\`\n🕒 С ${timeStart} - ${timeEnd}, \`перемена ${10} минут\`\n🍽 После этого урока *столовая*\n`;
                    d.setMinutes(d.getMinutes() + lessons[i].lesson_time + 10); // Урок + перемена
                } else {
                    scheduleText += `\`\`\`${i + 1}. ${lesson}, домашнее задание: ${lessons[i].homework}\`\`\`\n🕒 С ${timeStart} - ${timeEnd}, \`перемена ${10} минут\`\n`;
                    d.setMinutes(d.getMinutes() + lessons[i].lesson_time + 10); // Урок + перемена
                }
            }

            // Добавляем информацию о текущем уроке
            if (remainingTime) {
                scheduleText += `\n\`\`\`${remainingTime}\`\`\`\n`;
                if (nextLesson) {
                    scheduleText += `\`\`\`Следующий ${nextLesson.toUpperCase()}\`\`\`\n`;
                }
            }

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