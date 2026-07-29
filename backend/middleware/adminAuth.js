import jwt from 'jsonwebtoken';

const adminAuth = (req, res, next) => {
    try {
        const { token } = req.headers;
        if (!token) {
            return res.json({ success: false, message: 'Not Authorized Login Again' });
        }
        const jwtSecret = process.env.JWT_SECRET || 'vashtralaya_jwt_secret_key_2026';
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

        const token_decoded = jwt.verify(token, jwtSecret);
        // Handle both string payload (legacy) and object payload
        const decodedValue = typeof token_decoded === 'object' ? token_decoded.admin : token_decoded;
        
        if (typeof token_decoded === 'object') {
            // New format: token_decoded.admin === true
            if (!token_decoded.admin) {
                return res.json({ success: false, message: 'Not Authorized Login Again' });
            }
        } else {
            // Legacy format: decoded string equals email+password
            if (token_decoded !== adminEmail + adminPassword) {
                return res.json({ success: false, message: 'Not Authorized Login Again' });
            }
        }
        next();
    } catch (error) {
        console.log('Admin Auth Error:', error.message);
        res.json({ success: false, message: error.message });
    }
}


export default adminAuth;