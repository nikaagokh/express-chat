import axios from "axios";

export const mailVerified = async (req, res, next) => {
    const email = req.cookies.email;
    if(!email) {
        return res.redirect('/verify-email');
    }
    try {
        await axios.get(`http://localhost:3005/api/auth/check-email/${email}`);
        req.email = email;
        next();
    } catch(err) {
        return res.redirect('/verify-email');
    }
    
}
