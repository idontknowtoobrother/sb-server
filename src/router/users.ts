import express from 'express';

import { deleteUser, getAllUsers, updateUser } from '../controllers/users';
import { isAuthenticated, isOwner, isStaff } from '../middlewares';

export default (router: express.Router) => {
    router.get('/users', isAuthenticated, isStaff, getAllUsers);
    router.delete('/users/:id', isAuthenticated, isStaff, deleteUser)
    router.patch('/users/:id', isAuthenticated, isOwner, updateUser)
};