import express from 'express';

import authentication from './authentication';
import users from './users';
import queue from './queue';

const router = express.Router();

export default (): express.Router => {
    authentication(router);
    users(router);
    queue(router);
    return router;
}