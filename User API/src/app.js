// External imports
import express from 'express';
import cookieParser from 'cookie-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import path from 'path';
// Internal imports
import { __dirname, constants } from './utils/utils.js';
import { connections, connectDB } from './utils/database.js';
import userRouter from './router/user.router.js';

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser('myParser'));

app.use('/', userRouter);

// Swagger config
const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: "User API.",
            description: "User API documentation."
        }
    },
    apis: [path.join(__dirname, '../documentation/*.yaml')]
};
const specs = swaggerJSDoc(swaggerOptions);
console.log(path.join(__dirname, '../documentation/*.yaml'));
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

connections();
app.listen(constants.PORT, () => {
    console.log(`Server running at port ${constants.PORT}`);
});
connectDB();
