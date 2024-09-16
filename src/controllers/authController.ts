import "dotenv/config"
import { Request, Response} from "express";
import {db} from "../drizzle/db"
import { UserTable } from "../drizzle/schema";
import  bcrypt from "bcrypt";
import  jwt,  { Secret, JwtPayload }  from "jsonwebtoken";
import { eq } from "drizzle-orm";
import {z} from "zod";
import validator from 'validator';

const UserSchema = z.object({
    email: z.string().email({message: "Invalid email adress"}),
    password: z.string().min(7, {message: "Password must be 7 or more characters long"})
    .refine((val)=>{
        validator.isAlphanumeric(val, [ 'ar-AE'])
    }, {message: "The password must contain a non-Alphanumeric" })
})

type User = z.infer<typeof UserSchema>



const handleErrors = (err)=>{
    console.log(err.errors)
    let errors = { email: '', password: ''};

    err.errors.forEach(element => {
        if(element.message ==="Invalid email adress"){
            errors.email = "Please enter a valid email"
        }
        if(element.message==="Password must be 7 or more characters long"){
            errors.password ="Password must be 7 or more characters long"
        }
    });


    //incorrect email
    if(err.message === 'incorrect email'){
        errors.email = 'that email is not register'
    }


    //incorrect password
    if(err.message === 'incorrect password'){
        errors.password = 'the password is incorrect'
    }

    return errors
}


export const hashPassword =  async (password:string) =>{

    

    const salt = await bcrypt.genSalt();
    const hashPass = await bcrypt.hash(password, salt); 
    return hashPass
}




export const loginPassword = async (email:string, password:string) =>{
    // const user = await db.query.UserTable.findFirst({
    //     columns:{id: true,email:true,password:true}
    // })
    const [user] = await db.select({id: UserTable.id, password: UserTable.password, email: UserTable.email})
        .from(UserTable).where(eq(UserTable.email,email)).limit(1)

    if(user){
        const auth:boolean = await bcrypt.compare(password, user.password);
        if(auth){
            return user
        }
        throw Error('incorrect password')
    }
    throw Error( 'incorrect email')
}



const maxAge = 3*24*60*60
export const createToken = (id:string)=>{
    return jwt.sign({id},process.env.SECRET_JWT as string, {
        expiresIn: maxAge
    })
}




export const singup_get = (req, res)=>{
    res.render('signup')
}

export const login_get = (req, res)=>{
    res.render('login')
}

export const singup_post = async  (req:Request, res:Response)=>{
    const {email, password} = req.body
    // const userr: User = {email, password}
    try{
        UserSchema.parse({
            email,
            password,
        })

        const hashPass =   await hashPassword(password as string)
        const [user] = await db.insert(UserTable).values({
            email,
            password: hashPass,
        }).returning();
        const token = createToken(user.id);
        res.cookie('jwt',token, {httpOnly:true, maxAge:maxAge*1000})
        res.status(201).json({user:user.id});
    }
    catch(err){
        //console.log(err);
        const errors = handleErrors(err)
        res.status(400).json({errors})
    }
}

export const login_post = async (req:Request, res:Response)=>{
    const {email, password} = req.body
    

    try{
        const user = await loginPassword(email as string,password as string) 
        const token = createToken(user.id);
        res.cookie('jwt',token, {httpOnly:true, maxAge:maxAge*1000})
        res.status(200).json({user:user.id})
    }
    catch(err){
        const errors = handleErrors(err)
        res.status(400).json({errors})
    }
}


export const logout_get = (req, res) => {
    res.cookie('jwt','', {maxAge:1});
    res.redirect('/')
}
