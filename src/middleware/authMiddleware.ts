import jwt from "jsonwebtoken";
import { Request, Response} from "express";
import "dotenv/config"
import { db } from "../drizzle/db";
import { UserTable } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import  bcrypt from "bcrypt";



export const hashPassword =  async (req:Request, res:Response, next) =>{
    const salt = await bcrypt.genSalt();
    const hashPass = await bcrypt.hash(req.body.password, salt); 
    req.body.password = hashPass;
    next();
}


export const requireAuth = (req:Request, res:Response, next)=>{
    const tocken = req.cookies.jwt;


    //check if jwt it exists
    if(tocken){
        jwt.verify(tocken,process.env.SECRET_JWT as string, (err,decodedToken)=>{
            if(err){
                console.log(err.message)
                res.redirect('/login')
            }else{
                console.log(decodedToken);
                next();
            }
        })
    }else{
        res.redirect('/login');
    }
}



//check current user

export const checkUser = (req:Request,res:Response, next) =>{
    const tocken = req.cookies.jwt;

    if(tocken){
        jwt.verify(tocken,process.env.SECRET_JWT as string,  async (err,decodedToken)=>{
            if(err){
                console.log(err.message)
                res.locals.user = null;
                next()
            }else{
                console.log(decodedToken);
                let user = await db.select()
                .from(UserTable).where(eq(UserTable.id,decodedToken.id)).limit(1)
                res.locals.user = user[0]
                next();
            }
        })
    }else {
        res.locals.user = null;
        next();
    }
}