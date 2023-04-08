const router = require('express').Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  adminLogin,
} = require('../controllers/auth.controller');

//Register
router.post('/register', registerUser);

router.post('/login', loginUser);

router.post('/logout', logoutUser);

router.post('/admin-login', adminLogin);

module.exports = router;
