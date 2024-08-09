// auth.js
import jwt from 'jsonwebtoken'
import { constants } from '../utils.js'

const tokenBlacklist = new Set();
export const verifyTokenSocket = (socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
        const err = new Error('Authentication error');
        err.data = { content: 'Token not provided' }; 
        return next(err);
    }

    jwt.verify(token, constants.SECRET_KEY, (err, decoded) => {
        if (err) {
            const error = new Error('Authentication error');
            error.data = { content: 'Invalid token' }; 
            return next(error);
        }

        socket.user = decoded; 
        next();
    });
};
export function generateToken(req, res, next) {
    const { email, id } = req.user || req.body; 
    const token = jwt.sign({
        email: email,
        id: id
    }, constants.SECRET_KEY,
    { expiresIn: '30m' });
    res.locals.token = token; 
    res.header('auth-token', token);
    console.log(token);
    next();
}

export function verifyToken(req, res, next) {
    const token = req.cookies['auth-token'];
    const paramToken = req.params.token;
    if (!token && !paramToken) return res.status(401).send('Access Denied');
    
    if (tokenBlacklist.has(token) || tokenBlacklist.has(paramToken)) {
        return res.status(403).send('Token has been revoked');
    }
    try {
        console.log('verify', token);
        console.log('verify', paramToken);
        let verified;
        if (paramToken) {
            verified = jwt.verify(paramToken, constants.SECRET_KEY);
        } else if (token) {
            console.log('autorizado');
            verified = jwt.verify(token, constants.SECRET_KEY);
        }
        req.user = verified;
        console.log('req', req.user);
        next();
    } catch (error) {
        res.status(400).send('Invalid Token');
    }
}


export function revokeToken(req, res, next) {
    const token = req.cookies['auth-token'];
    if (!token) return res.status(400).send('Token is required');
    tokenBlacklist.add(token);
    console.log('-----------------------');
    console.log(tokenBlacklist);
    console.log('-----------------------');
    res.status(200).render('login'); 
}
