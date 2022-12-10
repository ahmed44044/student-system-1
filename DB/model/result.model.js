import { Schema , model,Types } from "mongoose";


const resultSchema=  new  Schema({
    userName:{
        type:String,
        required:[true, 'userName is required'],
        min:[2,'minium length 2 char'],
        min:[20,'max length 20 char'],
    },
    NationalID:{
        type:String,
        require:true,
        unique:true
    },
    Degree:{
        type:Number,
        required:true,
        max:100
    },
    subjectName:{
        type:String,
        required:true,
        unique:true
    },
    studentId:{
        type:Types.ObjectId,
        ref:'User'
    }

},
{
    timestamps:true
})

const resultModel= model('result',resultSchema)
export default  resultModel  