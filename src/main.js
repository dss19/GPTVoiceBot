import { Telegraf, session } from "telegraf";
import { message } from "telegraf/filters";
import { code } from "telegraf/format";
import config from "config"
import { ogg } from './ogg.js'
import { openai } from './openai.js'

const bot = new Telegraf(config.get("TELEGRAM_TOKEN"))

const INITIAL_SESSION = {
    messages: [],
}

bot.use(session())

bot.command('new', async (context) => {
    try {
        context.session = INITIAL_SESSION
        await context.reply('Начинаем новый диалог, жду вашего голосового или текстового сообщения (:')
    } catch (e) {
        console.log(`Ошибка новой сессии:`, e.message)
    }
})

bot.command('start', async (context) => {
    try {
        context.session = INITIAL_SESSION
        await context.reply('Жду вашего голосового или текстового сообщения (:')
    } catch (e) {
        console.log(`Ошибка запуска сессии:`, e.message)
    }
})

bot.on(message('text'), async (context) => {
    context.session ??= INITIAL_SESSION
    try {
        await context.reply(code('Сообщение принято, ждем ответ от бота...'))
        context.session.messages.push({ role: openai.roles.USER, content: context.message.text })
        const response = await openai.chat(context.session.messages)
        context.session.messages.push({ role: openai.roles.ASSISTANT, content: response.content })
        await context.reply(response.content)

    } catch (e) {
        console.log(`Ошибка текстового сообщения`, e.message)
    }
})

bot.on(message('voice'), async (context) => {
    context.session ??= INITIAL_SESSION
    try {
        await context.reply(code('Сообщение принято, ждем ответ от бота...'))
        const link = await context.telegram.getFileLink(context.message.voice.file_id)
        const userId = String(context.message.from.id)
        const oggPath = await ogg.create(link.href, userId)
        const mp3path = await ogg.toMp3(oggPath, userId)
        const text = await openai.transcription(mp3path)
        await context.reply(code(`Ваш запрос: ${text}`))
        context.session.messages.push({ role: openai.roles.USER, content: text })
        const response = await openai.chat(context.session.messages)
        context.session.messages.push({ role: openai.roles.ASSISTANT, content: response.content })
        await context.reply(response.content)

    } catch (e) {
        console.log(`Ошибка голосового сообщения`, e.message)
    }
})

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))