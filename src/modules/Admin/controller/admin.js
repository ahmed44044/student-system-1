import { create, findOne } from "../../../../DB/DBMethod.js";
import resultModel from "../../../../DB/model/result.model.js";
import studentAddModel from "../../../../DB/model/StudentAdd.model.js";
import userModel from "../../../../DB/model/user.model.js";
import { asyncHandler } from "../../../services/errorHandling.js";

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { sendEmail } from '../../../services/email.js'



export const addStudentNationalID= asyncHandler(
    async(req,res,next)=>{
        const {NationalID}= req.body
        const student= await findOne({
            model:studentAddModel,
            filter:{NationalID:NationalID}
        })
        if (student) {
            next(new Error('u can not Add this student because he is Already Add ',{cause:409}))
        } else {
            const newStu= await create({
                model:studentAddModel,
                data:{NationalID}
            })
            newStu ? res.status(201).json({message:"done",newStu}) : next(new Error('fail to add new student ',{cause:400}))
        }
    }
)


export const addResult= asyncHandler(
    async(req,res,next)=>{
        const {NationalID,Degree,userName,subjectName}= req.body
        const student= await findOne({model:userModel,
            filter:{NationalID:NationalID},
            select:'userName'
        })
        if (!student) {
            next(new Error('he is not student in faculty or he is not register in site',{cause:400}))
        } else {
            if (student.userName === userName) {
                const addRes= await create({model:resultModel,
                data:{NationalID,Degree,userName,subjectName,studentId:student._id}})
                addRes ? res.status(201).json({message:"done", addRes}) :  next(new Error(`fail to add result to ${student.userName}`,{cause:400 }))
            } else {
                next(new Error('plz Enter userName or NationalID true',{cause:400}))
            }
        }
    }
)






export const signupAdmin=asyncHandler(async(req,res,next)=>{

    const {userName,NationalID, email,password}=req.body
  
    
        const user= await findOne({model:userModel,filter:{email},select:'email'})
        if (user) {
           console.log(user);
            // res.status(409).json({message:"Email Exist"})
            next(new Error("Email Exist",{cause:409}))
        } else {
            const hash = bcrypt.hashSync(password, parseInt(process.env.SALTROUND))
            const newUser= new userModel({userName,email,NationalID,password:hash,role:'Admin'})
            const token = jwt.sign({id:newUser._id},process.env.EMAILTOKEN,{expiresIn:'1h'})
            const rfToken= jwt.sign({id:newUser._id},process.env.EMAILTOKEN)
            const link=`${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/confirmEmail/${token}`
            const linkRf=`${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/refToken/${rfToken}`
            const message=`
            <a href="${link}">confirmEmail</a> <br><a href="${linkRf}">Re-send confirmation email</a>
            `
            const info=await sendEmail(email,'confirmEmail',message)
            if (info.accepted.length) {
                const savedUser= await newUser.save()
                res.status(201).json({message:"done",savedUserID:savedUser._id})
            } else {
                // res.status(404).json({message:"Email rejected"})
                next(new Error("Email rejected",{cause:400}))
            }
        
    }
   
})