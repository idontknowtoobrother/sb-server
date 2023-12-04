require('dotenv').config();
import express from 'express';
import { createUser, getUserByPhone, getUserByUsername } from '../db/users';
import { random, authentication } from '../helpers';

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { username, password } = req.body;
        if(!username || !password) {
            return res.sendStatus(400);
        }

        const user = await getUserByUsername(username).select('+authentication.salt +authentication.password');
        if(!user) {
            return res.sendStatus(400);
        }

        const expectedHash = authentication(user.authentication.salt, password);
        if(expectedHash !== user.authentication.password) {
            return res.sendStatus(400);
        }

        if(user.authentication.password !== expectedHash) {
            return res.sendStatus(403);
        }

        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());
        await user.save();


        res.cookie(process.env.COOKIE_NAME || 'sb-auth', user.authentication.sessionToken, {domain: 'localhost', path: '/'});

        return res.status(200).json(user).end();
    }catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}


export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { username, password, confirmPassword, tel } = req.body;
        
        if (!username || !password || !confirmPassword || !tel) {
            return res.sendStatus(400);
        }

        const existingUser = await getUserByUsername(username);
        const existingPhone = await getUserByPhone(tel);
        if(existingUser || existingPhone){
            return res.sendStatus(409);
        }

        const salt = random();
        const user = await createUser({
            username,
            tel,
            authentication: {
                password: authentication(salt, password),
                salt,
            }
        })

        return res.status(201).json(user).end();
    }catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }

}