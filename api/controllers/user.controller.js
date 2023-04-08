const bcrypt = require("bcrypt")
const User = require("../models/User")


const updateUser = async (req, res) => {
    console.log(req.body);
    console.log(req.params.id);
    if (req.body.password && req.body.password != null) {
        try {
            const salt = await bcrypt.genSalt(10)
            req.body.password = await bcrypt.hash(req.body.password, salt)
        } catch (err) {
            return res.status(500).json(err)
        }
    }
    try {
        if (req.body.password == null) {
            delete req.body.password;
        }
        const user = await User.findByIdAndUpdate(req.params.id, { $set: req.body })
        res.status(200).json("Account has been updated")
    } catch (err) {
        return res.status(500).json(err)
    }

}


const deleteUser = async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {

        try {
            const user = await User.findByIdAndDelete(req.params.id)
            res.status(200).json("Account has been deleted successfully")
        } catch (err) {
            return res.status(500).json(err)
        }
    } else {
        return res.status(403).json("You can delete on your account")
    }
}

const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const { password, updatedAt, ...other } = user._doc
        res.status(200).json(other)
    } catch (err) {
        res.status(500).json(err)
    }
}

const getFriends = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        const friends = await Promise.all(
            user.following.map((friendId) => {
                return User.findById(friendId);
            })
        );
        let friendList = [];
        friends.map((friend) => {
            const { _id, username, profilePicture } = friend;
            friendList.push({ _id, username, profilePicture });
        });
        res.status(200).json(friendList)
    } catch (err) {
        res.status(500).json(err);
    }
}

const followUser = async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({ $push: { followers: req.body.userId } })
                await currentUser.updateOne({ $push: { following: req.params.id } })
                res.status(200).json("User has been followed")
            } else {
                res.status(403).json("You already following this user")
            }
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(403).json("You cant follow yourself")
    }
}


const unfollowUser = async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followers: req.body.userId } })
                await currentUser.updateOne({ $pull: { following: req.params.id } })
                res.status(200).json("User has been unfollowed")
            } else {
                res.status(403).json("You dont follow this user")
            }
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(403).json("You cant unfollow yourself")
    }
}

const getAllUser = async (req, res) => {
    try {
        const user = await User.find({}, { password: 0 });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
}


const blockUser = async (req, res) => {

    try {
        await User.findByIdAndUpdate(req.params.id, {
            $set: { blocked: true },
        });
        res.status(200).json("Account blocked successfully");

    } catch (err) {
        return res.status(500).json(err);
    }

}

const unblock = async (req, res) => {
console.log("RETEIII");
    try {
        await User.findByIdAndUpdate(req.params.id, {
            $set: { blocked: false },
        });
        res.status(200).json("Account unblocked successfully");

    } catch (err) {
        return res.status(500).json(err);
    }

}

const getUserStats = async (req, res) => {

    const today = new Date();
    const latYear = today.setFullYear(today.setFullYear() - 1);

    try {
        const data = await User.aggregate([
            {
                $project: {
                    month: { $month: "$createdAt" },
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 },
                },
            },
        ]);
        res.status(200).json(data)
        console.log(data);
    } catch (err) {
        res.status(500).json(err);
    }
}

const reportUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        req.body.userId = req.user.id
        req.body.name = req.user?.email
        req.body.postId = user._id
        req.body.post = user?.profilePicture
        req.body.desc = user.desc
        req.body.type = "user"
        if (user.reports.filter(e => e === req.user.id).length <= 0) {
            /* vendors contains the element we're looking for */
            await user.updateOne({ $push: { reports: req.user.id } });
            const newReport = new Report(req.body);
            const savedReport = await newReport.save();

            res.status(200).json(savedReport);
        } else {
            res.status(403).json("you already reported this user");
        }
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }

}


const rejectReport = async (req, res) => {
    try {
        console.log(req.query.name, "test");
        var isPostFound = true
        const user = await User.findById(req.params.id);

        // const report = await Report.findById(req.query.id)
        if (!user) {
            res.status(403).json("user not found");
            isPostFound = false
        }
        if (req.user.isAdmin) {
            await user.updateOne({ $pull: { reports: req.query.name } })
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
        const user = await User.findById(req.params.id);
        // const report = await Report.findById(req.query.id)
        if (!user) {
            res.status(403).json("user not found");
            isPostFound = false
        }
        if (req.user.isAdmin) {
            await user.updateOne({ blocked: true })
            await Report.deleteMany({ _id: req.query.id })
            res.status(200).json("report resolved");
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
    updateUser,
    deleteUser,
    getUser,
    followUser,
    unfollowUser,
    getFriends,
    getAllUser,
    blockUser,
    unblock,
    getUserStats,
    reportUser,
    rejectReport,
    resolveReport
}