import jwt from 'jsonwebtoken';
import { constants } from '../utils/utils.js';

export function generateToken(req, res, next) {
    const { email, id } = req.user || req.body; 
    const token = jwt.sign({ email, id }, constants.SECRET_KEY, { expiresIn: '30m' });
    res.locals.token = token; 
    res.header('auth-token', token);
    next();
}

export function verifyToken(req, res, next) {
    const token = req.headers['auth-token'];
    if (!token) return res.status(401).send('Access Denied');
    try {
        const verified = jwt.verify(token, constants.SECRET_KEY);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send('Invalid Token');
    }
}
