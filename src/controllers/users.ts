import express from 'express';

import { deleteUserById, getUsers, updateUserById } from '../db/users';
import { authentication, random } from '../helpers';
import _, { merge } from 'lodash';

export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await getUsers();

        return res.status(200).json(users);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const deleteUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const deletedUser = await deleteUserById(id);

        return res.status(200).json(deletedUser);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const updateUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const { password, confirmPassword, tel } = req.body;
        let _authentication = null
        
        if(password && confirmPassword) {
            if (password !== confirmPassword) {
                return res.sendStatus(400);
            }

            const salt = random();
            _authentication = {
                password: authentication(salt, password),
                salt,
            }
        }

        let updateUser: {} = {};
        if (_authentication !== null) {
            updateUser = {
                authentication: _authentication
            };
        }
        const user = await updateUserById(id, { ...updateUser, tel });
        if (!user) {
            return res.sendStatus(404);
        }

        if(_authentication !== null) {
            merge(req, { identity: user });
        }

        return res.status(200).json(user).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}