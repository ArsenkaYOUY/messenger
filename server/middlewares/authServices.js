import jwt from 'jsonwebtoken';

export function authenticateUserToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json( {
            success: false,
            error: 'Токен не предоставлен'
        })
    }

    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, userData) => {
        if (err) {
            return res.status(401).json( {
                success: false,
                error: 'Невалидный токен'
            })
        }
        req.user = userData;
        next();
    })
}