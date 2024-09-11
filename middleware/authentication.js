const jwt = require('jsonwebtoken')
const { StatusCodes } = require('http-status-codes')

const authenticateStaff = (req, res, next) => {
    const authHeader = req.header('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('No token provided or invalid format');
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: 'Unauthorized: No token provided or invalid format',
        })
    }
    const token = authHeader.split(' ')[1];
   
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.staff = {staff_id: payload.staff_id}
        console.log('Authenticated staff_id:', payload.staff_id);
        next()
    } catch (error) {
        console.error('Token verification failed:', error);
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: 'Unauthorized: Invalid token',
        })
    }
}

module.exports = authenticateStaff
