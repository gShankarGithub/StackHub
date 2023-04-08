const { addPost, updatePost, deletePost, likePost, getPost, getTimelinePost, addComment, allPosts, allReports, reportPost, rejectReport, resolveReport } = require("../controllers/post.controller");
const { verify, verifyTokenAndAdmin } = require("../middlewares/verifyToken");
const router = require("express").Router()

//Create a post 
router.post("/", verify, addPost)

//update a post 
router.put('/:id', verify, updatePost)

/// delete a post 
router.delete('/:id', verify, deletePost)

// like a post
router.put("/:id/like", verify, likePost)

// get a post 
router.get("/:id", verify, getPost)

// get timeline posts
router.get("/timeline/all/:id", verify, getTimelinePost)

router.put("/:id/comment", verify, addComment);

router.get("/", verifyTokenAndAdmin, allPosts);

//report post
router.get("/reports/:id", verify, allReports);

//report post
router.put("/:id/report", verify, reportPost);

//reject report
router.delete("/:id/report", verify, rejectReport);

//resolve report
router.delete("/:id/rejectReport", verify, resolveReport);


module.exports = router;