


export const asyncHandler=(fn)=>{
    return (req,res,next)=>{
        fn(req,res,next).catch(err=>{
            // res.status(500).json({message:"catch error",errMessage:err.message,stack:err.stack})
            next(new Error(err,{cause:500}))
        })
    }
}
export const globalErrorHandling=(err,req,res,next)=>{
    if (err) {
        if (process.env.MOOD==="DEV") {
            res.status(err['cause']||500).json({message:err.message,stack:err.stack})
        } else {
            res.status(err['cause']||500).json({message:err.message})
        }
        
    }
}