import express from 'express';

import {
    getAllQueue, getQueueFromId, getQueuesFromUserId,
    createNewQueue, deleteQueue, updateQueue
} from '../controllers/queue';

import { isAuthenticated, isStaff, parseUserId } from '../middlewares';

export default (router: express.Router) => {
    router.get('/queue', isAuthenticated, isStaff, getAllQueue);
    router.get('/queue/:id', isAuthenticated, isStaff, getQueueFromId);
    router.get('/queue/user', isAuthenticated, parseUserId, getQueuesFromUserId);
    router.post('/queue', isAuthenticated, parseUserId, createNewQueue);
    router.delete('/queue/:id', isAuthenticated, isStaff, deleteQueue);
    router.patch('/queue/:id', isAuthenticated, isStaff, updateQueue);
}

