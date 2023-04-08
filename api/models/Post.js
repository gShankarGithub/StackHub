const mongoose = require("mongoose")
const Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;

const PostSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        max: 500
    },
    img: {
        type: String,
        default: ""
    },
    likes: {
        type: Array,
        default: []
    },
    posted: {
        type: Date
    },
    reports: {
        type: Array,
        default: [],
    }
    ,
    comments: [{
        type: new mongoose.Schema({
            user: { type: ObjectId },
            name: { type: String },
            profilePic: { type: String },
            comment: { type: String }
        }, { timestamps: true })
    }]
},
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Post", PostSchema)