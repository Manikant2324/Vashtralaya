import jwt from 'jsonwebtoken';

const adminAuth = (req, res, next) => {
    try {
        const { token } = req.headers;
        if (!token) {
            return res.json({ success: false, message: 'Not Authorized Login Again' });
        }
        const token_decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Handle both string payload (legacy) and object payload
        const decodedValue = typeof token_decoded === 'object' ? token_decoded.admin : token_decoded;
        const expectedValue = typeof token_decoded === 'object'
            ? true
            : (process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD);
        
        if (typeof token_decoded === 'object') {
            // New format: token_decoded.admin === true
            if (!token_decoded.admin) {
                return res.json({ success: false, message: 'Not Authorized Login Again' });
            }
        } else {
            // Legacy format: decoded string equals email+password
            if (token_decoded !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
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