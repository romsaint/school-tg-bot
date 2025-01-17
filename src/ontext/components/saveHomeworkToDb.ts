import TelegramBot from "node-telegram-bot-api";
import { client } from "../../db/main";

export async function saveHomeworkToDb(msg: TelegramBot.Message, day: string) {
    await client.query(`
        UPDATE TABLE lessons
        SET homework = $1
        WHERE user_id = $2 AND   
    `)

}