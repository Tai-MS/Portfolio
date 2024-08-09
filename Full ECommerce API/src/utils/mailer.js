import nodemailer from 'nodemailer';
import { constants } from '../utils.js';

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587, 
    auth: {
        user: constants.USERMAILER,
        pass: constants.PASSMAILER
    }
});

export default transport;
