const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-shared-jwt-secret-here';

function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Unauthorized: No token provided' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // { sub: user_id, email, username, role }
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Forbidden: Invalid token' });
    }
}

module.exports = authMiddleware;
