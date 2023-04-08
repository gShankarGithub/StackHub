const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { findUser } = require("../services/user.service");
const { createUser } = require("../services/auth.service");


const registerUser = async (req, res) => {
    try {
        console.log(req.body);
        //generate new password
        if (req.body.username && req.body.email && req.body.password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);

            //create new user
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword,
                phone: req.body.phone,
                desc: "",
                city: "",
            });

            //save user and respond
            await newUser.save().then((user) => {
                const { password, updatedAt, ...other } = user._doc;
                res.status(200).json(other);
            }).catch((err) => { res.status(400).json("User Already Exist") });

        } else {
            res.status(400).json("fill all credentials")
        }
    } catch (err) {
        res.status(500).json(err)
    }
}

const loginUser = async (req, res) => {
    try {
        if (req.body.email && req.body.password) {
            const user = await findUser({ email: req.body.email })
            !user && res.status(404).send("User Not Found")

            if (user) {
                const validPassword = await bcrypt.compare(req.body.password, user.password)
                !validPassword && res.status(400).json("Wrong Password")

                //JWT test 
                if (validPassword) {
                    if (user.blocked) {
                        res.status(400).json("User Is Blocked")
                    }
                    const token = jwt.sign({ id: user._id, email: user.email }, process.env.SECRET)

                    const { password, ...others } = user._doc

                    res.cookie("accessToken", token, { httpOnly: true }).status(200).json(others)
                }
            }



        } else {
            res.status(400).json("please fill all the credentials")
        }

    }
    catch (err) {
        res.status(500).json(err)
    }

}

const logoutUser = (req, res) => {
    res.clearCookie("accessToken", {
        secure: true,
        sameSite: "none"
    }).status(200).json("User Has Been Logged Out")
}

//Admin Login

const adminLogin = async (req, res) => {
    console.log("ETHIE");
    try {
        if (req.body.email && req.body.password) {
            const user = await User.findOne({
                email: req.body.email
            });
            !user && res.status(404).json("User Not Found");

            if (user.isAdmin) {
                const validPassword = await bcrypt.compare(req.body.password, user.password);
                !validPassword && res.status(400).json("Wrong Password")

                if (validPassword) {
                    const accessToken = jwt.sign(
                        { id: user._id, email: user.email, isAdmin: user.isAdmin },
                        process.env.SECRET,
                        { expiresIn: "5d" }
                    );
                    const { password, updatedAt, profilePicture, coverPicture, followers, followings, blocked, email, createdAt, ...other } = user._doc;


                    res.cookie("accessToken", accessToken, {
                        httpOnly: true,
                    }).status(200).json({ other, accessToken })

                }
            }
        } else {
            res.status(400).json("please fill all the credentials")
        }
    } catch (err) {
        res.status(500).json(err)
    }
}


module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    adminLogin
}