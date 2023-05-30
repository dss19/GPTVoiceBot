# GPTVoiceBot
Телеграм-бот для текстового или голосового взаимодействия с ChatGPT

# Запуск
для запуска бота - /start

для создания новой сессии чата - /new

# Установка на сервер
1. Установить Docker 
2. Клонируем репозиторий
3. В папке /config создаем файл production.json
4. В файле production.json пишем следующее:
```
{
  "TELEGRAM_TOKEN": "Токен-Вашего-Телеграм-Бота",
  "OPENAI_KEY": "API-ключ-из-Вашего-личного-кабинета-на-openai.com",
  "TYPE_ENV": "production"
}
```
5. Создаем docker image
```sh
$ docker build -t yourBotName .
```
6. Запускаем 
```sh
docker run -d -p 3000:3000 --name yourBotName --rm yourBotName
```
