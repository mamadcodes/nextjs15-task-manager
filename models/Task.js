import mongoose from 'mongoose'

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: '10:00AM - 5:30PM',
    },
    status: {
        type: String,
        default: "under-review"
    }
})

export default mongoose.models.Task || mongoose.model('Task', TaskSchema)