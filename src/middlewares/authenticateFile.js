import { SECRET_KEY } from "../utils/index.js";
import jwt from 'jsonwebtoken';

export const authenticateFile = async (req, res, next) => {
    const token = req.query.access_token;
    if (!token) {
        return res.status(401).json({ message: 'მომხმარებელი არაავტორიზირებულია'});
    }
    jwt.verify(token, SECRET_KEY, (err) => {
        if (err) {
            return res.status(401).json({ message: 'მომხმარებელი არაავტორიზირებულია'});
        }
        next();
    });
}