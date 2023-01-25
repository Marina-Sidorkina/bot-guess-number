const TelegramApi = require('node-telegram-bot-api');
const {keyboardOptions, firstGameButtonOptions, newGameButtonOptions} = require('./options');

const token = '5969276070:AAG4U3pKZP-zH2-x2BW0ZkwTrKHWLtorw7I';

const bot = new TelegramApi(token, {polling: true});
const chats = {};

/**
 * Запуск игры
 * @param chatID {number}
 */

const startGame = async (chatID) => {
  // Отправляем сообщение
  await bot.sendMessage(
      chatID,
      `Сейчас я загадаю число от 0 до 9, а ты должен отгадать...`
  );

  // Рандомное число для данного чата записываем в поле объекта с чатами
  chats[chatID] = Math.floor(Math.random() * 10);

  // Отправляем текст и клавиатуру с числами
  await bot.sendMessage(
      chatID,
      `Отгадывай :)`,
      keyboardOptions
  );
}

/**
 * Управление чатом
 */
const start = () => {
  // Формируем команды, которые пользователь может увидеть и запустить в меню
  bot.setMyCommands([
    {command: '/start', description: 'Начальное приветствие'},
    {command: '/game', description: 'Отгадать загаданное число'},
  ])

  // Обрабатываем поступившее сообщение
  bot.on('message', async (msg) => {
    const text = msg.text;
    const chatID = msg.chat.id;

    // Обработка сообщения /start
    if (text === '/start') {
      // Отправляем стикер
      await bot.sendSticker(
          chatID,
          'https://tlgrm.eu/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/7.webp'
      );
      // Отправляем сообщение и кнопку для запуска игры
      return bot.sendMessage(
          chatID,
          `Добро пожаловать в чат!`,
          firstGameButtonOptions
      );
    }

    // Обработка сообщения /game
    if (text === '/game') {
      return startGame(chatID);
    }

    // Обработка неизвестного сообщения
    return bot.sendMessage(
        chatID,
        `Я тебя не понимаю...:(`
    )
  });

  // Обрабатываем поступивший ответ при нажатии кнопок запуска игры или кнопки с числом
  bot.on('callback_query', async (msg) => {
    const data = msg.data;
    const chatID = msg.message.chat.id;

    if(data === '/newGame' || data === '/firstGame') {
      return startGame(chatID);
    }

    // Обработка ответа на загаданное число
    if(parseInt(data, 10) === chats[chatID]) {
      return bot.sendMessage(
          chatID,
          `Поздравляю! :) Ты выбрал правильное число ${chats[chatID]}!`,
          newGameButtonOptions
      );
    } else {
      return bot.sendMessage(
          chatID,
          `К сожалению, ты не угадал... Я загадал число ${chats[chatID]} :(`,
          newGameButtonOptions
      );
    }
  })
}

start();
