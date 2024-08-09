//External imports
import express from 'express';
import cookieParser from 'cookie-parser';
import hbs from 'hbs';
import { createServer } from 'http'; 
import { Server } from 'socket.io';
import multer from 'multer'
import session from 'express-session'
import MongoStore from 'connect-mongo'; 
import passport from 'passport';
import cors from 'cors'
 
//Internal imports
import { __dirname, constants, rootDir } from './utils.js';
import { connections, connectDB } from './utils/database.js';
import productsController from './controllers/products.controller.js';
import cartsController from './controllers/carts.controller.js';
import chatController from './controllers/chat.controller.js';


import initializePassport from './config/passport.config.js'


const app = express();
initializePassport();
app.use(session({
    secret:constants.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: constants.MONGO_CONNECT,
        ttl: 10000,
    }),
    secret: constants.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
}))
app.use(passport.initialize());
app.use(passport.session());
const server = createServer(app);
const io = new Server(server);

app.use(cors({
    origin: '*'
}));

//Multer config
const upload = multer({ dest: __dirname + '/multer' });
app.use('multer', express.static('multer')) 

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser('myParser'));

//Routes imports
import usersRouter from './routes/user.router.js';
import productsRouter from './routes/products.route.js';
import cartsRouter from './routes/carts.route.js';
import sessionsRouter from './routes/session.route.js';
import userSessionRouter from './routes/user.session.route.js';
import viewsRouter from './routes/views.route.js';
import ticketRouter from './routes/ticket.route.js'

//Routes
app.use('/user', usersRouter);
app.use('/api', productsRouter);
app.use('/carts', cartsRouter);
app.use('/sessions', sessionsRouter);
app.use('/userSession', userSessionRouter);
app.use('/ticket', ticketRouter)
app.use('/', viewsRouter);

// HBS Configuration
hbs.registerPartials(__dirname + '/views');
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/public'));

//Passport y express-sessions

//CHAT
const users = {}

io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('message', (message) => {
        console.log('Message from client:', message);
    });

    socket.on('getProducts', async (query) => {
        try {
            const products = await productsController.getAll();
            socket.emit('productsResponse', { 
                result: 'success', 
                payload: products,
                options: query 
            });
        } catch (error) {
            socket.emit('productsResponse', { result: 'error' });
        }
    });

    socket.on('addProductsToCart', async(fields) => {
        const { cId, pId } = fields;
        const response = await cartsController.addProductToCart(fields);
        socket.emit('productsResponse', response);
    });

    socket.on('getCartByIdResponse', async (email) => {
        try {
            const response = await cartsController.getCart(email);
            socket.emit('cartResponse', response);
        } catch (error) {
            console.error('Error getting cart:', error);
            socket.emit('cartResponse', { result: 'error', message: error.message });
        }
    });

    socket.on('newUser', async(username) => {
        users[socket.id] = username
        socket.emit('userConnected', username)
        chatController.returnChat().then(messages => {
            messages.forEach(message => {
                socket.emit('message', {username: message.user, message: message.message})
            });
        }).catch(error => {
            console.error(`Error: ${error}`);
        })
    })

    socket.on("chatMessage", (message) => {
        const username = users[socket.id]
        if(message.length < 1){
            socket.emit("error")
        }else{
            socket.emit("response", chatController.updateDb(users[socket.id],message))
            socket.emit("message", { username, message })
        }
    })
});

//Server init
connections();
server.listen(constants.PORT, () => { 
    console.log(`Server running at port ${constants.PORT}`);
});
connectDB();