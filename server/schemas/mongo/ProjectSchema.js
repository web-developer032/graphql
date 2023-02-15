const mongoose = require("mongoose");

const projectSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide project name."],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        enum: {
            values: ["pending", "progress", "queue", "completed"],
            message: "Status must be pending, processing, queue or completed",
        },
    },
});

const Project = mongoose.model("projects", projectSchema);
module.exports = Project;
