import passport from 'passport';
import local from 'passport-local';
import GitHubStrategy from 'passport-github2';
import userClass from '../persistence/user.persistence.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { generateToken } from '../middlewares/auth.js';

dotenv.config();

const LocalStrategy = local.Strategy;
const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const initializePassport = () => {
    passport.serializeUser((user, done) => {
        console.log(user);
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await userClass.getUser(id);
            if (!user) {
                return done(new Error('User not found'));
            }
            done(null, user);
        } catch (error) {
            done(error);
        }
    });

    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            const { firstName, lastName, email, age } = req.body;
            try {
                let user = await userClass.getUser(username);
                if (user) {
                    return done(null, false, { message: 'Email already in use' });
                }
                const newUser = {
                    firstName,
                    lastName,
                    email,
                    age,
                    password: createHash(password)
                };
                let result = await userClass.createUser(newUser);
                done(null, result);
            } catch (error) {
                return done('Error ' + error);
            }
        }
    ));

    passport.use('login', new LocalStrategy(
        { usernameField: 'email' },
        async (username, password, done) => {
            try {
                const user = await userClass.getUser(username);
                if (!user) {
                    return done(null, false, { message: 'User not found' });
                }
                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (!isPasswordValid) {
                    return done(null, false, { message: 'Incorrect password' });
                }
    
                // Crear documento temporal para la sesión del usuario
                const sessionData = {
                    userId: user._id,
                    loginTime: new Date(),
                    sessionId: `session-${Date.now()}`
                };
                await userClass.createSession(sessionData);
    
                user.lastConnection = new Date();
                await user.save();
                return done(null, user);
            } catch (error) {
                return done('Error ' + error);
            }
        }
    ));
    

    passport.use('github', new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
        scope: ['user:email']
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let email = null;
            if (profile.emails && profile.emails.length > 0) {
                email = profile.emails[0].value;
            } else {
                return done(null, false, { message: 'No email found in GitHub profile' });
            }
    
            let user = await userClass.getUser(email);
            if (!user) {
                const [firstName, lastName] = profile._json.name.split(' ');
                const fullName = `${firstName} ${lastName || ''}`;
                const newUser = {
                    email: profile._json.email,
                    fullName: fullName,
                    age: 18,
                    password: ' '
                };
                let result = await userClass.createUser(newUser);
                return done(null, result);
            } else {
                return done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }));
};

export default initializePassport;
