const User = require("../models/User");
const bcrypt = require("bcrypt");

const createUser = async (details) => {
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(details.password, salt)
        //Create user
        const newUser = new User({
            username: details.username,
            email: details.email,
            password: hashedPassword,
            desc:"",
            city:"",
            profilePicture:"https://qph.cf2.quoracdn.net/main-qimg-cf89e8e6daa9dabc8174c303e4d53d3a",
            coverPicture:"https://thumbs.dreamstime.com/z/white-background-paper-texture-stock-photo-abstract-art-watercolor-88428008.jpg"
        })
        //Save user and respond
       return user = await newUser.save();
    } catch (error) {

    }
}

module.exports = {
    createUser
}