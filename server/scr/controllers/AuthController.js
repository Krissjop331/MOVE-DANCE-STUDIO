const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const {validationResult} = require("express-validator");
const secret = "SECRET_KEYS";
const cookie = require("cookie-parser");

const db = require("../models/index");
const User = db.User;







const generateToken = (id, admin = false) => { 
    const payload = { 
        id 
    }; 

    return jwt.sign(payload, secret, {expiresIn: "100h"}); 
}


class AuthController {

    async getUsers(req, res) {
        const users = await User.findAll();

        if(users.length > 0) {
            return res.json(users);
        } 
        else {
            return res.status(400).json({message: `Пользователей нет`});
        }
    }


    async signUp(req, res) {
        try {
            const errors  = validationResult(req);

            if(!errors.isEmpty()) {
                return res.status(400).json({  errors: errors.array() });
            }
            
            const user = await User.findOne({ where: { email: req.body.email } });
            const users = await User.findAll();
            const userLength = users.length + 1;

            if(user) {
                delete req.body.email;
                delete req.body.password;

                return res.status(400).json({ message: `Пользователь с таким email ${req.body.email} уже существует` });
            }

            const token = generateToken(userLength, false);  
            req.headers.authorization = userLength + " " + "Bearer" + " " + token;
            res.cookie('authorization', userLength + ' ' + "Bearer" + ' ' + token, {expires: new Date(Date.now() + 60 + 60 + 1000) });
            const hashPassword = bcrypt.hashSync(req.body.password, 8);

            const userCreate = await User.create({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                password: hashPassword,
                admin: false
            })

            delete req.body.email;
            delete req.body.password;

            return res.status(201).json({ status: "success", token: req.headers.authorization, users: userCreate });

        } catch (error) {
            console.log(`Register Error - ${error.message}`);
            return res.status(403).json({ message: `Register Error - ${error.message},`, reqbody: req.body});
        }
    }



    async signIn(req, res) {
        try {
            
            const errors = validationResult(req);
            let admin = false;

            if(!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const users = await User.findAll();
            const user = await User.findOne({ where: { email: req.body.email } });
            const id = user.id;
            

            if(!user) {
                delete req.body.email;
                delete req.body.password;

                return res.status(400).json({ message: `Пользователь с таким email ${req.body.email} не существует` });
            }

            const validPassword = bcrypt.compare(req.body.password, user.password);

            if(!validPassword) {
                delete req.body.email;
                delete req.body.password;

                return res.status(400).json({ message: "Неверно введен пароль" });
            }

            if(user.admin == true) {
                admin = true;
            }

            const token = generateToken(id, admin);
            req.headers.authorization = id + ' ' + "Bearer" + ' ' + token;
            res.cookie('auth', id + ' ' + "Bearer" + ' ' + token, { expires: new Date(Date.now() + 60 * 60 * 1000) });

            delete req.body.username;
            delete req.body.password;

            return res.status(201).json({ message: "Пользователь вошел", status: "success", token: req.headers.authorization, user });

        } catch (error) {
            console.log(`Auth Error - ${error.message}`);
            return res.status(403).json({ message: `Auth Error - ${error.message}` });
        }
    }

    async signOut(req, res) {
        let auth;
        
        if(req.headers.authorization) {
            auth = req.cookies.auth.split(' ')[2];
            const {id} = jwt.verify(auth, secret);

            const user = await User.findAll({where: {id: id}});

            if(res.clearCookie(`${id} Bearer ${auth}`)) {
                return res.json({message: "success"});
            }
            return res.json({ message: "error" });
        }

        return res.json({ message: "Нет токена" });
    }
}


module.exports = new AuthController();