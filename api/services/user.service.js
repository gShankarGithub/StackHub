const User = require("../models/User");



const findUser = (query) => {
    try {
        return User.findOne(query)
    } catch (err) {
        console.log(err);
    }

}


module.exports = {
    findUser
}