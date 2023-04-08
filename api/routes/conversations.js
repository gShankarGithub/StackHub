const router = require("express").Router()
const Conversation = require('../models/Conversation')

//new Conv
router.post("/", async (req, res) => {
    const newConversation = new Conversation({
        members: [req.body.senderId, req.body.receiverId]
    })

    try {
        const savedConversation = await newConversation.save()
        res.status(200).json(savedConversation)
    } catch (err) {
        res.status(500).json(err)
    }
})


//get conv
router.get("/:userId", async (req, res) => {
    try {
        const conversation = await Conversation.find({
            members: { $in: [req.params.userId] },
        }
        )
        res.status(200).json(conversation)
    } catch (err) {
        res.status(500).json(err)

    }
})

//Get conversation includes two userId
router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
    try {
        console.log(req.params.firstUserId);
        console.log(req.params.secondUserId);
        const conversation = await Conversation.findOne({
            members: { $all: [req.params.firstUserId, req.params.secondUserId] },
        });
        console.log(conversation);
        res.status(200).json(conversation)
    } catch (err) {
        res.status(500).json(err);
    }
});


module.exports = router;