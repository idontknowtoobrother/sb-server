import { getQueueById, getQueues, getQueuesByUserId, createQueue, deleteQueueById, updateQueueById } from '../db/queue';
import express from 'express';



export const getAllQueue = async (req: express.Request, res: express.Response) => {
    try {
        const queues = await getQueues();

        return res.status(200).json(queues);
    }catch(error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const getQueueFromId = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const queue = await getQueueById(id);

        return res.status(200).json(queue);
    }catch(error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const getQueuesFromUserId = async (userId: string, req: express.Request, res: express.Response) => {
    try {
        const queues = await getQueuesByUserId(userId);

        return res.status(200).json(queues);
    }catch(error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const createNewQueue = async (userId: string, req: express.Request, res: express.Response) => {
    try {
        const { date, picture, moreInformation } = req.body;
        if (!userId || !date) {
            return res.sendStatus(400);
        }
        const queue = await createQueue({ userId, date, picture, moreInformation });

        return res.status(200).json(queue);
    }catch(error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const deleteQueue = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const deletedQueue = await deleteQueueById(id);

        return res.status(200).json(deletedQueue);
    }catch(error) {
        console.log(error);
        return res.sendStatus(400);
    }
};


export const updateQueue = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const { date, picture, moreInformation } = req.body;

        const queue = await updateQueueById(id, { date, picture, moreInformation });
        if (!queue) {
            return res.sendStatus(404);
        }

        return res.status(200).json(queue);
    }catch(error) {
        console.log(error);
        return res.sendStatus(400);
    }
};