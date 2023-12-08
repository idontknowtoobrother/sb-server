import mongoose from "mongoose";

const QueueSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    date: { type: Date, required: true },
    picture: { type: String },
    moreInformation: { type: String },
    accepted: { type: Boolean, required: true, default: false }
})

export const QueueModel = mongoose.model('Queue', QueueSchema);

export const getQueues = () => QueueModel.find();
export const getQueueById = (id: string) => QueueModel.findById(id);
export const getQueuesByUserId = (userId: string) => QueueModel.find({ userId });
export const createQueue = (values: Record<string, any>) => new QueueModel(values)
    .save().then((queue) => queue.toObject());
export const deleteQueueById = (id: string) => QueueModel.findOneAndDelete({ _id: id });
export const updateQueueById = (id: string, values: Record<string, any>) => QueueModel.findByIdAndUpdate(id, values, {new: true});