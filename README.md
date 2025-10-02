# Move Dance Studio — клиент + API (Express + Sequelize)

### Стек

- **Frontend:** HTML5, CSS3, Vanilla JS (бургер‑меню, якорная навигация, модальные окна).
- **Backend:** Node.js, Express, Sequelize (MySQL), JWT, express‑validator, multer, cookie‑parser, CORS.
- **БД:** MySQL.
- **CLI:** sequelize‑cli (сид данных).

---

## Описание сайта (для портфолио)

Лендинг **Move Dance Studio** — студия танцев с разделами «Наши тренировки», «Преподаватели», «Атмосфера», «Прайс», «Контакты». Есть верхнее меню с бургер‑иконкой для мобильной версии, якорная прокрутка по секциям, CTA‑кнопки. На бэкенде реализована авторизация (JWT), роли пользователей (admin), управление расписанием занятий и бронированиями (аренда слота).

Ключевые сценарии:

- Просмотр расписания занятий (публичный).
- Авторизация пользователей (логин/логаут).
- **Админ:** добавление/редактирование/удаление слотов расписания.
- **Админ:** создание/удаление «аренды» (бронь) для слота.

> В `client/` находится чистый статический фронт. Его можно разместить на любой статический хостинг (GitHub Pages/Netlify), а `server/` — на VPS/Render/railway.app и т. п.

---

## Быстрый старт

### 1) Backend (`server/`)

#### Требования

- Node.js 18+
- MySQL 8+ (или совместимая)
- Порт API по умолчанию: **5000**

#### Установка и запуск

```bash
cd server
npm i
# создайте БД 'move_dance_studio' (или поменяйте в scr/config/config.json)
# заполните сиды (создастся админ)
npx sequelize-cli db:seed:all

# разработка
npm run dev
# сервер поднимется на http://localhost:5000
```

#### Конфигурация БД

Файл: `server/scr/config/config.json`

```json
{
  "development": {
    "username": "root",
    "password": "",
    "database": "move_dance_studio",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
```

#### Роли и тестовые пользователи

Сид создаёт администратора:

- **email:** `admin@mail.ru`
- **password:** `admin`
  Не используйте это в продакшене.

### 2) Frontend (`client/`)

Это статичный сайт. Запустить локально можно через любой статический сервер:

```bash
# из корня проекта
npx serve client
# или
npx live-server client
```

Также удобно задеплоить на GitHub Pages/Netlify/Cloudflare Pages.

---

## API (кратко)

Базовый роутер: `server/scr/routes/router.js`

### Аутентификация (`/auth`)

- `GET /auth/users` — список пользователей (для отладки).
- `POST /auth/signin` — вход, ожидает `email`, `password`. Возвращает JWT.
- `POST /auth/signup` — регистрация **(требует авторизации и роли admin)**.
- `POST /auth/signout` — выход.

**Авторизация:** передавайте токен в заголовке `Authorization: Bearer <token>`.

### Расписание и аренды (`/schedules`)

- `GET /schedules` — получить все слоты расписания.
- `GET /schedules/:id` — получить конкретный слот.
- `POST /schedules/create` — создать слот **(admin)**. Поля: `name`, `classes_time`.
- `POST /schedules/update/:id` — обновить слот **(admin)**.
- `POST /schedules/delete` — массовое удаление **(admin)**.
- `POST /schedules/deleteId/:id` — удалить по id **(admin)**.
- `POST /schedules/rentCreate/:scheduleId` — создать бронь **(admin)**.
- `POST /schedules/rentDelete/:scheduleId` — удалить бронь **(admin)**.

### Модели (Sequelize)

- **User** — `first_name`, `last_name`, `email`, `password`, `admin` (bool), и т. д.
- **Schedules** — `name`, `classes_time`, `user_id` (автор).
- **Rentals** — аренда, связи: `user_id` ↔ `schedule_id`.
