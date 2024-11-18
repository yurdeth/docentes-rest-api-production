import Users from "../models/UsersModel.js";
import bcrypt from "bcryptjs";
import {checkPassword} from "../utils/password-verify.js";

export const getAllUsers = async (req, res) => {
    try {
        const users = await Users.getAll();

        if(!users){
            return res.json({
                message: "No se encontraron usuarios",
                success: false
            })
        }

        return res.json({
            data: users,
            success: true
        });
    } catch (err) {
        res.status(500).send(err);
    }
};

export const getAllEmails = async (req, res) => {
    try {
        const users = await Users.getAllEmails();

        if(!users){
            return res.json({
                message: "No se encontraron usuarios",
                success: false
            })
        }

        return res.json({
            data: users,
            success: true
        });
    } catch (err) {
        res.status(500).send(err);
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await Users.getById(req.params.id);

        if(!user){
            return res.json({
                message: "No se encontró el usuario",
                success: false
            })
        }

        res.json({
            data: user,
            success: true
        });
    } catch (err) {
        res.status(500).send(err);
    }
};

export const getUserByMail = async (req, res) => {
    try {
        const email = req.query.email;
        const user = await Users.getByEmail(email);

        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado",
                success: false
            });
        }

        res.json({
            name: user.name,
            email: user.email,
            password: user.password,
            department: user.department_name,
            career: user.career_name,
            enabled: user.enabled,
            success: true,
        });
    } catch (err) {
        console.error('Error al obtener usuario por email:', err.message);
        res.status(500).json({ error: 'Error interno del servidor', details: err.message });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const email = req.query.email;
        const user = await Users.doesEmailExists(email);

        if (!user.exists) {
            return res.json({
                message: "Este correo no existe",
                success: false
            });
        }

        return res.json({
            success: true,
        });
    } catch (err) {
        console.error('Error al obtener usuario por email:', err.message);
        res.status(500).json({ error: 'Error interno del servidor', details: err.message });
    }
};

export const verifyUser = async (req, res) => {
    try {

        if (!req.query.email){
            return res.status(400).json({
                error: "No se proveyó de un correo electrónico",
                success: false
            });
        }

        if (!req.query.password){
            return res.status(400).json({
                error: "No se proveyó de una contraseña",
                success: false
            });
        }

        const user = await Users.verifyUser(req.query.email);

        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado",
                success: false
            });
        }

        if (user.enabled) {
            return res.status(401).json({
                message: "Este usuario ya ha sido activado",
                enabled: true,
                success: true
            });
        }

        const isPasswordValid = await checkPassword(req.query.password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Contraseña incorrecta",
                success: false
            });
        }
        return res.status(200).json({
            message: "User enabled",
            user: await Users.getById(user.id),
            success: true
        });
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
};

export const enableUser = async (req, res) => {
    try {
        const user = await Users.enableUserStatus(req.params.id);
        res.json({
            data: user,
            message: "Contraseña actualizada correctamente",
            success: true
        });
    } catch (err) {
        res.status
    }
}

export const disableUser = async (req, res) => {
    try {
        const user = await Users.disableUserStatus(req.params.id);
        res.json({
            data: user,
            message: "Contraseña actualizada correctamente",
            success: true
        });
    } catch (err) {
        res.status
    }
}

export const init = async (req, res) => {
    try {
        const init = await Users.init();
        res.json(init);
    } catch (err) {
        res.status(500).send(err);
    }
};
