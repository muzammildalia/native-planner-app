import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        person: {
            type: mongoose.ObjectId,
            ref: "users",
        },
        title: {
            type: String,
            required: true,
        },
        // notes_category_id: {
        //     type: mongoose.ObjectId,
        //     ref: "notes",
        // },
        category: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true,
        }

    },
    { timestamps: true }
)

export default mongoose.model("tasks", taskSchema);