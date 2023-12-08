require('dotenv').config();
import crypto from 'crypto';
import mongoose from 'mongoose';

export const random = () => crypto.randomBytes(128).toString('base64');
export const authentication = (salt: string, password: string) => {
    return crypto.createHmac('sha256', [salt, password].join('/')).update(process.env.SECRET_KEY).digest('hex')
};


export const getUserResponse = (user: any) => {
    let responseUser: {
        _id: mongoose.Types.ObjectId;
        username: string;
        tel: string;
        role?: string; // Add the 'role' property with an optional string type
    } = {
        _id: user._id,
        username: user.username,
        tel: user.tel
    }

    // I use role to check if user is staff or not
    // the way that more secure is using another frontend of dashboard
    // Or make a website is server side rendering by hex <3
    if (user.role && user.role === 'staff') {
        responseUser.role = 'staff';
    }

    return responseUser;
}