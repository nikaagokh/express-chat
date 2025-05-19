import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../utils/index.js'

export const authenticateJWT = async (req, res, next) => {
    const token = req.cookies.access_token;
    console.log(req.cookies);
    console.log(req.headers);
    console.log('ss');
    if (!token) {
        return res.status(401).json({ message: 'მომხმარებელი არაავტორიზირებულია'});
    }
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'მომხმარებელი არაავტორიზირებულია'});
        }
        console.log(decoded);
        const user = decoded.user;
        req.user = user;
        req.userId = user.user_id;
        next();
    });
}