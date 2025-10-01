const db = require("../models/index");
const Schedules = db.Schedules;
const User = db.User;
const Rentals = db.Rentals;

const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const secret = "SECRET_KEYS";
const { Op } = require('sequelize');




class SchedulesController {

    async getAll(req, res) {
        try {
            const { name, classes_time, createdAt } = req.query || req.params;
            let token;
            let userId;

            if (req.headers.authorization) {
                token = req.headers.authorization.split(' ')[2];
            }

            if (token) {
                const decodedToken = jwt.verify(token, secret);
                userId = decodedToken.id;

            }

            const filterOptions = {};

            if (name) {
                filterOptions.name = { [Op.like]: `%${name}%` };
            }
            if (classes_time) {
                filterOptions.classes_time = { [Op.like]: `%${classes_time}%` };
            }
            if (createdAt) {
                filterOptions.createdAt = { [Op.like]: `%${createdAt}%` };
            }

            if (userId) {
                const isAuthor = await Schedules.findOne({
                    where: {
                        user_id: userId,
                        ...filterOptions, // Добавил фильтры сюда
                    },
                });

                if (isAuthor) {
                    const schedules = await Schedules.findAll({
                        where: filterOptions,
                        include: [
                            { model: User },
                            { model: Rentals, required: false },
                        ],
                    });

                    return res.status(200).json({ data: schedules });
                } else {
                    // await Rentals.create({ user_id: userId, ...filterOptions });

                    const schedules = await Schedules.findAll({
                        where: filterOptions,
                        include: [
                            { model: User },
                            { model: Rentals, required: false },
                        ],
                        attributes: ["id", "name", "classes_time", "user_id"]
                    });

                    return res.status(200).json({ status: "success", data: schedules });
                }
            } else {
                const schedules = await Schedules.findAll({
                    where: filterOptions,
                    include: [
                        { model: User },
                        { model: Rentals, required: false },
                    ],
                });

                return res.status(200).json({ data: schedules });
            }
        } catch (error) {
            console.log(`Auth Error - ${error.message}`);
            return res.status(403).json({ message: `DataSchedules Error - ${error.message}` });
        }
    }

    async getSchedulesId(req, res) {
        try {
            const id = req.params.id;
            const schedules = await Schedules.findOne({
                where: {
                    id: id
                },
                include: [
                    { model: User },
                    { model: Rentals }
                ]
            });

            if (!schedules) {
                return res.status(400).json({ message: "Такого расписания не существует", status: none, data: schedules })
            }

            return res.status(200).json({ message: "Получено расписание", status: "success", data: schedules, data: schedules })

        } catch (error) {
            console.log(`Auth Error - ${error.message}`);
            return res.status(403).json({ message: `DataSchedules(ID) Error - ${error.message}`, status: error });
        }
    }



    async createSchedules(req, res) {
        try {

            let token;
            let userId;
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            if (req.headers.authorization) {
                token = req.headers.authorization.split(' ')[2];
            }

            if (token) {
                const decodedToken = jwt.verify(token, secret);
                userId = decodedToken.id;
            }

            if (req.body.name && req.body.classes_time) {

                const user = await User.findAll();
                let userLength = user.length;

                if (req.body.user_id > userLength) {
                    return res.status(403).json({ message: "Такого пользователя не существует", status: "error" });
                }

                let schedule = await Schedules.findOne({
                    where: {
                        name: req.body.name,
                        user_id: req.body.user_id
                    },
                    include: [
                        { model: User },
                        { model: Rentals }
                    ]
                });

                if (schedule) {
                    delete req.body.name;
                    delete req.body.user_id;

                    let schedule = await Schedules.update({
                        name: req.body.name,
                        classes_time: req.body.classes_time,
                        user_id: req.body.user_id || 1,
                        include: [
                            {
                                model: Rentals
                            }
                        ]
                    });

                    if (req.body.rentals) {
                        let rentals = await Rentals.create({
                            userId,
                            schedule_id: schedule.id,
                            include: [
                                {
                                    model: Schedules
                                },
                                {
                                    model: User
                                }
                            ]
                        })
                    }

                    return res.status(400).json({ message: "Такое расписание уже существует", data: schedule });
                }


                const scheduleCreate = await Schedules.create({
                    name: req.body.name,
                    classes_time: req.body.classes_time,
                    user_id: req.body.user_id || userId
                });

                if (!scheduleCreate) {
                    return res.status(400).json({ message: "Failed to create schedule", status: "error" });
                }

                const rentailCreate = await Rentals.create({
                    user_id: userId,
                    schedule_id: scheduleCreate.id
                })

                return res.status(201).json({ status: "success", schedule: scheduleCreate });
            } else {
                return res.status(403).json({ message: "Не все поля введены", success: "error" });
            }



        } catch (error) {
            console.log(`Auth Error - ${error.message}`);
            return res.status(403).json({ message: `DataSchedules(CREATE) Error - ${error.message}`, status: "error" });
        }
    }


    async updateSchedule(req, res) {
        try {
            const id = req.params.id;
            const data = req.body.data;

            const userId = await User.findOne({
                where: {
                    first_name: data[2].split(' ')[0],
                    last_name: data[2].split(' ')[1]
                },
                attributes: ['id']
            })

            console.log("Userttt" + " " + userId);
    
            const schedule = await Schedules.findOne({
                where: {
                    id
                },
                include: [
                    { model: User },
                    { model: Rentals }
                ]
            });
    
            if (!schedule) {
                const newSchedule = await Schedules.create({
                    name: data.name || "",
                    classes_time: data.classes_time.split(' ')[0] || "",
                    user_id: data.user_id || ""
                });
    
                return res.status(201).json({ status: "success", data: newSchedule, datas: req.body.data });
            }
    
            const updatedSchedule = await schedule.update({
                name: data[0] || schedule.name,
                classes_time: data[1].split(" ")[0] || schedule.classes_time,
                user_id: userId || schedule.user_id
            });
    
            return res.status(200).json({ status: "success", data: updatedSchedule, datas: req.body.data || "No", userId: userId });
        } catch (error) {
            console.log(`Auth Error - ${error.message}`);
            return res.status(500).json({ message: `DataSchedules(UPDATE) Error - ${error.message}`, status: "error" });
        }
    }

    async deleteSchedules(req, res) {
        try {

            await Rentals.destroy();
            await Schedules.destroy();

            return res.status({ message: "Удаление произошло успешно", status: "success" });

        } catch (error) {
            console.log(`Auth Error - ${error.message}`);
            return res.status(500).json({ message: `DataSchedules(DELETE_ALL) Error - ${error.message}`, status: "error" });
        }
    }

    async deleteSchedule(req, res) {
        try {
            const id = req.params.id;
            const schedules = await Schedules.findOne({
                order: [['createdAt', 'DESC']]
            });


            await Schedules.destroy({
                where: {
                    id: id || schedules.id
                }
            });

            return res.status(200).json({ message: "Удаление произошло успешно", status: "success" });

        } catch (error) {
            console.log(`Auth Error - ${error.message}`);
            return res.status(500).json({ message: `DataSchedules(DELETE_ID) Error - ${error.message}`, status: "error" });
        }
    }


    async rentScheduleCreate(req, res) {
        try {
            const { scheduleId } = req.params || req.body;
            let token;
            let userId;
    
            if (req.headers.authorization) {
                token = req.headers.authorization.split(' ')[2];
            }
    
            if (token) {
                const decodedToken = jwt.verify(token, secret);
                userId = decodedToken.id;
            }
    
            // Проверяем, существует ли аренда для данного пользователя и расписания
            const existingRental = await Rentals.findOne({
                where: {
                    schedule_id: scheduleId,
                    user_id: userId,
                },
                include: [
                    { model: User },
                    { model: Schedules }
                ]
            });
    
            if (existingRental) {
                // Если аренда существует, удаляем ее
                await existingRental.destroy();
                return res.status(200).json({ message: "Расписание снято с аренды", status: "success" });
            }
    
            // Аренды нет, создаем новую
            const newRental = await Rentals.create({
                user_id: userId,
                schedule_id: scheduleId,
            });
    
            return res.status(200).json({ message: "Расписание успешно арендовано", status: "success", data_create: newRental });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Ошибка сервера", status: "error" });
        }
    }
    
    async rentScheduleDelete(req, res) {
        try {
            const { scheduleId } = req.params;
            let token;
            let userId;
    
            if (req.headers.authorization) {
                token = req.headers.authorization.split(' ')[2];
            }
    
            if (token) {
                const decodedToken = jwt.verify(token, secret);
                userId = decodedToken.id;
            }
    
            // Проверяем, существует ли аренда для данного пользователя и расписания
            const existingRental = await Rentals.findOne({
                where: {
                    schedule_id: scheduleId,
                    user_id: userId,
                },
                include: [
                    { model: User },
                    { model: Schedules }
                ]
            });
    
            if (existingRental) {
                // Если аренда существует, удаляем ее
                await existingRental.destroy();
                return res.status(200).json({ message: "Расписание снято с аренды", status: "success" });
            }
    
            return res.status(404).json({ message: "Аренда не найдена", status: "error" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Ошибка сервера", status: "error" });
        }
    }

}


module.exports = new SchedulesController();
