import express from 'express';
import { createUser, getUserByPhone, getUserByUsername } from 'db/users';
import { random, authentication } from 'helpers';


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