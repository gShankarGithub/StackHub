const mongoose = require("mongoose")

const StorySchema = new mongoose.Schema({
    img: {
        type: String,
        default: ""
    },
    userId: {
        type: String,
        required:true
    }
},
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Story", StorySchema)