const Joi = require('joi');

const signUpValidation = (req,res,next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(3).max(20).required(),
        phoneNo: Joi.string().pattern(/^[0-9]{10}$/).required()
    });
    const { error } = schema.validate(req.body);

    if(error){
        return res.status(400)
            .json({message: "BAD request", error})
    }
    next();
}
const LogInValidation = (req,res,next) => {
    const schema = Joi.object({
        phoneNo: Joi.string().pattern(/^[0-9]{10}$/),
        email: Joi.string().email().required(),
        password: Joi.string().min(3).max(20).required(),
    }).xor('email', 'phoneNo');
    const {error} = schema.validate(req.body);
    if(error){
        return res.status(400)
            .json({message: "BAD request", error})
    }
    next();
}
module.exports = {
    signUpValidation,
    LogInValidation
}