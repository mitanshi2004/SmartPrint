const isAuth = require('../middlewares/ensure-auth');
const router = require('express').Router();

router.get('/', isAuth, (req, res) => {
    console.log(`Logged In User detail`, req.user);
    res.status(200).json([
        { print: "Color", perPagePrice: "5" },
        { print: "B/W", perPagePrice: "2" }
    ]);
});
module.exports = router