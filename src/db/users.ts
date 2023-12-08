import mongoose from "mongoose";
import Roles from "../enums/roles";

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    tel: { type: String, required: true, unique: true },
    role: { type: String, enum: Object.values(Roles), required: true, default: Roles.USER},
    authentication: {
        password: { type: String, required: true, select: false },
        salt: { type: String, select: false },
        sessionToken: { type: String, select: false },
    }
})


export const UserModel = mongoose.model('User', UserSchema);


export const getUsers = () => UserModel.find();
export const getUserByUsername = (username: string) => UserModel.findOne({ username });
export const getUserByPhone = (tel: string) => UserModel.findOne({ tel });
export const getUserBySessionToken = (sessionToken: string) => UserModel.findOne({
    'authentication.sessionToken': sessionToken
});
export const getUserById = (id: string) => UserModel.findById(id);
export const createUser = (values: Record<string, any>) => new UserModel(values)
    .save().then((user) => user.toObject());
export const deleteUserById = (id: string) => UserModel.findOneAndDelete({ _id: id });
export const updateUserById = (id: string, values: Record<string, any>) => UserModel.findByIdAndUpdate(id, values, { new: true});