// user.controller.js
import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../config/index.js";

export const signUp = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const newUser = await userModel.create({
            ...req.body,
            password: hashedPassword
        });
        console.log("newUser !", newUser);
        res.status(201).json({ message: "User created successfully!", newUser })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error while creating user" });
    }
}

export const userList = async (req, res) => {
    try {
        const allUsers = await userModel.find();
        res.status(201).json(allUsers)
        console.log(allUsers)
    }
    catch (error) {
        console.log(error)
    }
}

export const login = async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email });
        if (!user) return res.status(404).json("User not found")
        const comparePassword = await bcrypt.compare(req.body.password, user.password);
        if (!comparePassword) return res.status(400).json("wronf credentias ! ")
        const token = jwt.sign(
            { id: user._id },
            env.token,
            { expiresIn: "1h" }
        )
        const { password, ...others } = user._doc
        res.cookie('acces_token', token, { httpOnly: true }).status(200).json(others)
        console.log("connexion réussie")
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error while login" })
    }
}
export const logout = async (req, res) => {
    try {
        res.clearCookie('acces_token')
        res.status(200).json({ message: "Logout successfully" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error while logout" })
    }
}
export const deleteUser = async (req, res) => {
    try {
        const user = await userModel.findOneAndDelete(req.params);
        res.status(201).json({ message: "User deleted successfully!", user })
    } catch (error) {
        res.status(500).json({ message: "Error while deleting user" })
    }
}