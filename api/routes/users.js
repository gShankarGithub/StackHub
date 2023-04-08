const router = require("express").Router();
const { verify } = require("jsonwebtoken");
const { updateUser, deleteUser, getUser, followUser, unfollowUser, getFriends, getAllUser, blockUser, unblock, reportUser, rejectReport, resolveReport, getUserStats } = require("../controllers/user.controller");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");

//update user
router.put("/:id", verify, updateUser)

//delete user
router.delete("/:id", verify, deleteUser)

//get a user
router.get("/:id", verify, getUser)

//Get all users

router.get("/", verify, getAllUser)

// Get Friends
router.get("/friends/:userId", verify, getFriends);

//follow a user 
router.put("/:id/follow", verify, followUser)

//unfollow a user
router.put("/:id/unfollow", verify, unfollowUser)

router.put("/block/:id", blockUser);

//unblock user
router.put("/unblock/:id", unblock);

//report user
router.put("/:id/reportUser", verify, reportUser);

//reject report
router.delete("/:id/report", verify, rejectReport);

//resolve report
router.delete("/:id/rejectReport", verify, resolveReport);

//get userStats
router.get("/stats/:id",verify,getUserStats);


module.exports = router