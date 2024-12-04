import express from 'express';
import cookieParser from 'cookie-parser';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { configureHbs, registerPartials } from './configure-hbs.js';
import indexRouter from './src/routes/index.js';
import { ErrorHandler } from './src/utils/index.js'; 
import { configureIO } from './src/gateway/chat.js';
import { authenticateFile } from './src/middlewares/authenticateFile.js';


const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

configureHbs();
const app = express();
configureIO(app);

app.use('/public', express.static(path.resolve(__dirname, "frontend", "public")));
app.use('/files', express.static(path.resolve(__dirname, "files")));
app.set("views", path.join(__dirname, "src", "views"));
app.set("view engine", "hbs");

registerPartials(path.join(__dirname, 'src/views/partials'));

app.use(cookieParser());
app.use(express.json());
app.use(indexRouter);
app.use(ErrorHandler);
