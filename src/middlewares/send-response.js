export default(req,res,next)=>{
    const sendSuccess = (statusCode,message,body=null)=>{
        return res.status(statusCode).json({
            success:true,
            message,
            body
        })
    };
    const sendFailure = (statusCode,message)=>{
        return res.status(statusCode).json({
            success:false,
            message,
            body:null
        })
    }

    res.sendSuccess = sendSuccess;
    res.sendFailure = sendFailure;
    next();
}