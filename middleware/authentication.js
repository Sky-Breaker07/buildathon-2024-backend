const jwt = require('jsonwebtoken')
const { StatusCodes } = require('http-status-codes')

const authenticateStaff = (req, res, next) => {
    const token = req.header('Authorization')
    if (!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: 'Unauthorized',
        })
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.staff = {staff_id: payload.staff_id}
        next()
    } catch (error) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: 'Unauthorized',
        })
    }
}

module.exports = authenticateStaff
