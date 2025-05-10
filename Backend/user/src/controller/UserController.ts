import { NextFunction, Request, Response } from "express";
import User from '../model/User';
import axios from 'axios';


//Post a User
export const addUser = async(req: Request, res: Response) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({error: "Cannot add a customer"});
    }
};

//Get a customer for a specific firebaseUid

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
    const firebaseUid = req.params.firebaseUid;
    try {
        const user = await User.findOne({ firebaseUid: firebaseUid });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch customer" });
    }
};