import express from 'express';

import {
    getAllQueue, getQueueFromId, getQueuesFromUserId,
    createNewQueue, deleteQueue, updateQueue
} from '../controllers/queue';

import { isAuthenticated, isStaff } from '../middlewares';

export default (router: express.Router) => {
    // GET all queues (accessible to authenticated staff)
    router.get('/queue', isAuthenticated, isStaff, getAllQueue);

    // GET queues for a specific user (accessible to authenticated users)
    router.get('/queue/user', isAuthenticated, getQueuesFromUserId);

    // GET a specific queue by ID (accessible to authenticated staff)
    router.get('/queue/:id', isAuthenticated, isStaff, getQueueFromId);

    // POST a new queue (accessible to authenticated users)
    router.post('/queue', isAuthenticated, createNewQueue);

    // DELETE a specific queue by ID (accessible to authenticated staff)
    router.delete('/queue/:id', isAuthenticated, isStaff, deleteQueue);

    // PATCH (update) a specific queue by ID (accessible to authenticated staff)
    router.patch('/queue/:id', isAuthenticated, isStaff, updateQueue);
}
