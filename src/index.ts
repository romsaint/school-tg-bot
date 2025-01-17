import TgBot from 'node-telegram-bot-api'
import dotenv from 'dotenv'
import { startCommand } from './commands/start'
import { onText } from './ontext/onText'
dotenv.config()

const token = process.env.API_KEY_BOT
if(!token) {
    throw new Error('TOKEN!')
}
export const bot = new TgBot(token, {
    polling: true
})

export const commands = [{command: "start", description: 'Запустить бота'}]
export const setLessonsState: {[key: number]: string} = {}
export const setLessonsInDb: {[key: number]: {day: string, id: number | null}} = {}
export const setLessonsAreCreated: {[key: number]: string} = {}
export const setHomeworkState: {[key: number]: string} = {}
export const chooseLessonState: {[key: number]: string} = {}

export const backChooseLessonState: {[key: number]: string} = {}

export const startBtns = ['Установить расписание', 'Cледующий урок', 'Установить домашнее задание']
export const dayOfWeek = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']

bot.setMyCommands(commands)

bot.onText(/\/start/, startCommand)
bot.on('text', onText)