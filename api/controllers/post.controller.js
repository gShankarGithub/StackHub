const Post = require("../models/Post");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const Report = require("../models/Reports")

const moment = require("moment")




//Add new Post
const addPost = async (req, res) => {
    try {
        const token = req.cookies.accessToken
        if (!token) return res.status(401).json("Not Logged In")

        jwt.verify(token, process.env.SECRET, async (err, userInfo) => {
            if (err) return res.status(403).json("Token is not valid!")

            req.body.posted = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")

            const newPost = new Post(req.body)
            const savedPost = await newPost.save()
            res.status(200).json(savedPost)
        })
    } catch (err) {
        res.status(500).json(err)
    }
}

//Update Post
const updatePost = async (req, res) => {
    try {
        console.log(req.body.userId);
        const post = await Post.findById(req.params.id)
        if (post.userId === req.body.userId) {
            await post.updateOne({ $set: req.body })
            res.status(200).json("The post has been updated")
        } else {
            res.status(403).json("you can update only your post")
        }
    } catch (err) {
        res.status(500).json(err)
    }
}

//Delete Post
const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (post.userId === req.body.userId) {
            await post.deleteOne({ $set: req.body })
            res.status(200).json("The post has been deleted")
        } else {
            res.status(403).json("you can delete only your post")
        }
    } catch (err) {
        res.status(500).json(err)
    }
}

//Like Post
const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } })
            res.status(200).json("The post has been liked")
        } else {
            await post.updateOne({ $pull: { likes: req.body.userId } })
            res.status(200).json("The post has been disliked")

        }
    } catch (err) {
        res.status(500).json(err)

    }
}


//Get Post 
const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        res.status(200).json(post)
    } catch (err) {
        res.status(500).json(err)
    }
}


//Get All Post in Timeline

const getTimelinePost = async (req, res) => {
    try {
        const token = req.cookies.accessToken
        if (!token) return res.status(401).json("Not Logged In")

        jwt.verify(token, process.env.SECRET, async (err, userInfo) => {
            if (err) return res.status(403).json("Token is not valid!")

            const currentUser = await User.findById(req.params.id);
            const userPosts = await Post.find({ userId: currentUser._id });

            const friendPosts = await Promise.all(
                currentUser.following.map((friendId) => {
                    return Post.find({ userId: friendId })
                })
            )
            res.json(userPosts.concat(...friendPosts))
        })


    } catch (err) {
        res.status(500).json(err)
    }
}


const addComment = async (req, res) => {
    try {
        const comment = req.body
        const post = await Post.findById(req.params.id);

        await post.updateOne({ $push: { comments: comment } });
        res.status(200).json("commented successfully");

    } catch (err) {
        res.status(500).json(err);
    }
}

const allPosts = async (req, res) => {
    try {
        // const user = await User.findOne({ username: req.params.username });
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json(err);
    }
}


const reportPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        console.log(req.user);
        req.body.userId = req.user.id
        req.body.name = req.user?.email
        req.body.postId = post._id
        req.body.post = post?.img
        req.body.desc = post.desc
        req.body.type = "post"
        if (post.reports.filter(e => e === req.user.id).length <= 0) {
            /* vendors contains the element we're looking for */
            await post.updateOne({ $push: { reports: req.user.id } });
            const newReport = new Report(req.body);
            const savedReport = await newReport.save();

            res.status(200).json(savedReport);
        } else {
            res.status(403).json("You Already Reported This Post");
        }
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }

}


const allReports = async (req, res) => {
    try {
        const reports = await Report.find();
        res.status(200).json(reports);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

const rejectReport = async (req, res) => {
    try {
        console.log(req.query.name, "test");
        var isPostFound = true
        const post = await Post.findById(req.params.id);
        console.log(post);
        // const report = await Report.findById(req.query.id)
        if (!post) {
            res.status(403).json("post not found");
            isPostFound = false
        }
        if (post.userId === req.user.id || req.user.isAdmin) {
            await post.updateOne({ $pull: { reports: req.query.name } }).then((res) => {
                console.log(res);
            });
            await Report.deleteMany({ _id: req.query.id })
            res.status(200).json("report removed");
        } else {
            res.status(403).json("authorization failed");
        }
    } catch (err) {
        if (isPostFound) {
            res.status(500).json(err);
        }
        console.log(err);
    }
}

const resolveReport = async (req, res) => {
    try {
        var isPostFound = true
        const post = await Post.findById(req.params.id);
        // const report = await Report.findById(req.query.id)
        if (!post) {
            res.status(403).json("post not found");
            isPostFound = false
        }
        if (post.userId === req.user.id || req.user.isAdmin) {
            await post.deleteOne()
            await Report.deleteMany({ _id: req.query.id })
            res.status(200).json("post deleted");
        } else {
            res.status(403).json("authorization failed");
        }
    } catch (err) {
        if (isPostFound) {
            res.status(500).json(err);
        }
        console.log(err);
    }
}

module.exports = {
    addPost,
    updatePost,
    deletePost,
    likePost,
    getPost,
    getTimelinePost,
    addComment,
    allPosts,
    resolveReport,
    rejectReport,
    allReports,
    reportPost

}