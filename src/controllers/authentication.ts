require('dotenv').config();
import express from 'express';
import { createUser, getUserByPhone, getUserBySessionToken, getUserByUsername } from '../db/users';
import { random, authentication, getUserResponse } from '../helpers';

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { username, password } = req.body;
        if(!username || !password) {
            return res.sendStatus(401);
        }

        const user = await getUserByUsername(username).select('+authentication.salt +authentication.password');
        if(!user) {
            return res.sendStatus(401);
        }

        const expectedHash = authentication(user.authentication.salt, password);
        if(expectedHash !== user.authentication.password) {
            return res.sendStatus(401);
        }

        if(user.authentication.password !== expectedHash) {
            return res.sendStatus(401);
        }

        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());
        await user.save();

        if (!user.authentication.sessionToken) {
            return res.sendStatus(401);
        }
        res.cookie(process.env.COOKIE_NAME || 'sb-auth', user.authentication.sessionToken, { maxAge: 900000, httpOnly: true });
        console.log('setted cookie', user.authentication.sessionToken)
        const responseUser = getUserResponse(user);

        return res.status(200).json(responseUser).end();
    }catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const loginBySessionToken = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const { sessionToken } = req.cookies;
        if(!sessionToken) {
            return res.sendStatus(400);
        }

        const user = await getUserBySessionToken(sessionToken);
        if(!user) {
            return res.sendStatus(400);
        }

        const responseUser = getUserResponse(user);

        return res.status(200).json(responseUser).end();
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

        if (password !== confirmPassword) {
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

        const responseUser = getUserResponse(user);

        return res.status(201).json(responseUser).end();
    }catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }

}


export const logout = async (req: express.Request, res: express.Response) => {
    try {
        const { sessionToken } = req.cookies;
        if(!sessionToken) {
            return res.sendStatus(400);
        }

        const user = await getUserBySessionToken(sessionToken);
        if(!user) {
            return res.sendStatus(400);
        }

        user.authentication.sessionToken = '';
        await user.save();
        // clear cookies
        res.clearCookie(process.env.COOKIE_NAME || 'sb-auth', {domain: 'localhost', path: '/'});

        return res.sendStatus(200);

    }catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}