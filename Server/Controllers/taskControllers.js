import taskModel from "../Models/taskModel.js";
import userModel from "../Models/userModel.js";
import notesModel from "../Models/notesModel.js";

export const createTasksController = async (req, res) => {
    try {
        const { title, category, text } = req.body;
        const userId = req.user._id;
        if (!title) {
            return res.status(401).send({
                message: "Title is required",
            });
        }
        if (!text) {
            return res.status(401).send({
                message: "There is Nothing to save",
            });
        }
        const existingUser = await userModel.findById(userId);
        if (!existingUser) {
            return res.status(404).send({
                success: false,
                message: "User not found",
            });
        }
        const task = await new taskModel({
            person: userId,
            title,
            category,
            text,
        }).save();
        res.status(201).send({
            success: true,
            message: "Task Successfully Saved",
            task: {
                _id: task._id,
                title: task.title,
                category: task.category,
                person: {
                    _id: existingUser._id,
                    name: existingUser.name,
                },
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in creating Tasks",
            error,
        });
    }
}

export const getTasksController = async (req, res) => {
    const { userId } = req.params;
    try {
        const Tasks = await taskModel.find({ person: userId }).exec();
        res.status(200).send(Tasks);
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in getting Tasks",
            error,
        });
    }
}