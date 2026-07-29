import jwt from 'jsonwebtoken';

const userAuth = (req, res, next) => {
    try {
        const { token } = req.headers;
        if (!token) {
            return res.json({ success: false, message: 'Not Authorized Login Again' });
        }
        const jwtSecret = process.env.JWT_SECRET || 'vashtralaya_jwt_secret_key_2026';
        const token_decoded = jwt.verify(token, jwtSecret);
        req.userId = token_decoded.id;
        if (req.body && typeof req.body === 'object') {
            req.body.userId = token_decoded.id;
        }
        next();
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export default userAuth;
