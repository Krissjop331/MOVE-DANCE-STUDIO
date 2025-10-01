const jwt = require('jsonwebtoken');
const secret = "SECRET_KEYS";

const db = require('../models/index');
const User = db.User;

module.exports = async (req, res, next) => {
    if (req.method === "OPTIONS") {
        next();
    }

    try {
        let token;

        if (req.headers.authorization) {
            token = req.headers.authorization.split(' ')[2];
            const { id } = jwt.verify(token, secret);

            let user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ message: "Пользователь не найден", status: "error" });
            }

            let admin = user.admin;

            if (!admin) {
                return res.status(403).json({ message: "У вас нет доступа", status: "error" });
            }
            next();

        } else {
            return res.status(401).json({ message: "Вы не авторизованы", status: "error" });
        }
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: "Неверный токен", status: "error" });
    };
};