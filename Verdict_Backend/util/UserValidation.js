const zod = require('zod'); // is used for validation

const SignupValidation = zod.object({
    body: zod.object({
        username: zod.string().min(2).max(20),
        email: zod.string().email(),
        password: zod.string().min(8).max(20),
    })
})

module.exports = SignupValidation