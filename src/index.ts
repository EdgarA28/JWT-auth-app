import "dotenv/config"
import express, { Request, Response } from 'express';
import  authRoutes from './routes/authRoutes'

import {db} from "./drizzle/db"
import { UserTable } from "./drizzle/schema";
import cookieParser from 'cookie-parser'
import { checkUser, requireAuth } from "./middleware/authMiddleware";

// async function main(){
//     await db.delete(UserTable)
// }

// main()




const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(express.static('src/public'));
app.use(express.json());
app.use(cookieParser())

// view engine
app.set('view engine', 'ejs',);
app.set('views', 'src/views')

// database connection



// routes
app.get('*', checkUser);
app.get('/', (req:Request, res:Response) => res.render('home'));
app.get('/smoothies', requireAuth,(req, res) => res.render('smoothies'));

app.use(authRoutes);


// app.get('/set-cookies',(req, res)=>{
//     res.cookie('newUser', false);
//     res.cookie('isEmployee', true, {maxAge:1000*60*60*24, secure:false, httpOnly:true})
//     res.send('you got the cookies!')
// })

// app.get('read-cookies',(req, res)=>{
//     const cookies = req.cookies;
//     console.log(cookies)
//     res.json(cookies)
// })





app.listen(port, ()=>{console.log(`Server running at http://localhost:${port}`)})