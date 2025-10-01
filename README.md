# Move Dance Studio — клиент + API (Express + Sequelize)

> Готовый проект для портфолио: статический фронтенд (vanilla HTML/CSS/JS) и backend на Node.js/Express с JWT‑авторизацией и MySQL (Sequelize).

## Состав репозитория

```
Vlad/
├── client/        # Статичный лендинг: index.html, CSS, изображения, иконки
└── server/        # API: Express, Sequelize, JWT, валидация, ролевая модель (admin)
```

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

> ⚠️ **Безопасность**: для публичного репозитория замените этот файл на `config.example.json` (с плейсхолдерами) и добавьте `config.json` в `.gitignore` (см. ниже).

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

---

## Репозиторий и .gitignore

> **Важно:** в архиве присутствуют тяжёлые бинарные файлы (например, `client/cn.s05.e22a.mp4`) и `server/node_modules/`. Перед первым коммитом положите `.gitignore` в корень, чтобы не закоммитить лишнее, или выполните `git rm -r --cached` для уже добавленных директорий.

### Рекомендуемый `.gitignore` (корень)

Смотрите готовый файл в корне или ниже в этом README.

- игнор `node_modules`, кэши, логи
- игнор `.env*`
- игнор build‑директорий (`dist`, `build`, `.next`, `out`)
- игнор `server/scr/config/config.json` (и коммитим `config.example.json`)

---

## Что можно улучшить (для портфолио)

- 🔐 Вынести секреты/JWT и креды БД в `.env` + использовать `dotenv`.
- 🛡️ Добавить rate‑limit/helmet, централизованную обработку ошибок, логирование.
- 🗃️ Настроить миграции (`sequelize-cli db:migrate`) и схемы вместо sync/сидов «как есть».
- 🧪 Покрыть базовые юнит‑тесты (Auth, Schedules).
- 🧭 Исправить опечатки в путях: `scr/` → `src/`, `midlleware` → `middleware`.
- 🌐 Отдавать фронт статикой из Express (или настроить CORS по списку доменов).
- 📦 Видео (`*.mp4`) — через Git LFS или CDN, чтобы не раздувать репозиторий.
- 🧭 В интерфейсе поправить мелкие орфографические ошибки («Преподаватели»).

---

## Локальная разработка: быстрые команды

```bash
# 1) клонировать или инициализировать репозиторий
git init
# создайте .gitignore из примера ниже

# 2) backend
cd server && npm i && cd ..
npx sequelize-cli db:seed:all

# 3) старт серверного API
npm --prefix server run dev

# 4) статический фронт (в другом терминале)
npx serve client

# 5) коммит и пуш
git add .
git commit -m "feat: initial import (client + server)"
git branch -M main
git remote add origin https://github.com/<user>/<repo>.git
git push -u origin main
```

---

## Лицензия

MIT (можно заменить).

---

## Приложение A — Корневой .gitignore

Скопируйте это в `./.gitignore`:

```
# OS / editors
.DS_Store
Thumbs.db
.vscode/
.idea/

# logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
logs/
*.log

# env
.env
.env.*
!.env.example

# node
node_modules/
**/node_modules/

# builds & caches
dist/
build/
.cache/
.next/
out/
coverage/
.tmp/
.eslintcache

# server
server/uploads/
server/scr/config/config.json

# frontend artifacts (in case)
client/dist/
client/build/

# misc
*.sqlite
*.pid
```

---

> Если хочешь, я могу отдельно сгенерировать `server/README.md` и `client/README.md` — но обычно достаточно одного корневого README с разделами по проектам.
