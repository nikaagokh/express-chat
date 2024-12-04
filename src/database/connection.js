import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

export const pool = mysql.createPool({
    host:'autorack.proxy.rlwy.net',
    database:'railway',
    user:'root',
    password:'IVJpuxtIDCtekCHWuowcerUvhAGfvsLq',
    port:32266,
    timezone:'Z'
}).promise();