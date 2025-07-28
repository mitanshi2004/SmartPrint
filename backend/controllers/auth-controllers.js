const bcrypt = require('bcrypt');
const jwt = require(`jsonwebtoken`);
const UserModel = require('../models/user');

const signup = async (req, res) => {
    try {
        const { name, email, password, phoneNo } = req.body;

        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(409).json({
                message: `User already exists, you can login`,
                success: false
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userModel = new UserModel({ name, email, password: hashedPassword, phoneNo });
        await userModel.save();

        res.status(201).json({
            message: "Signup successful",
            success: true
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        const errorMsg = `Auth Failed email or password is wrong` 

        if (!user) {
            return res.status(403).json({
                message: errorMsg ,
                success: false
            });
        }

        const isPassEqual = await bcrypt.compare(password, user.password);
        if(!isPassEqual){
            return res.status(403).json({
                message: errorMsg ,
                success: false
            });
        }
        const jwtToken = jwt.sign(
            {email: user.email, _id: user._id},
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )
        res.status(200).json({
            message: "Login successful",
            success: true,
            jwtToken,
            email,
            name: user.name
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

module.exports = {
    signup,
    login
};
