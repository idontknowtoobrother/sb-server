import express from 'express';

import { deleteUser, getAllUsers, getUserFromId, updateUser } from '../controllers/users';
import { isAuthenticated, isOwner, isStaff } from '../middlewares';

export default (router: express.Router) => {
    router.get('/users', isAuthenticated, isStaff, getAllUsers);
    router.patch('/users/staff/:id', isAuthenticated, isStaff, updateUser)
    router.get('/users/:id', isAuthenticated, isStaff, getUserFromId);
    router.delete('/users/:id', isAuthenticated, isStaff, deleteUser)
    router.patch('/users/:id', isAuthenticated, isOwner, updateUser)
};