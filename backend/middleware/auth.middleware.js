import jwt from 'jsonwebtoken'
export const isLoggedIn = async (req, res, next)=>{
    try {
        const token = req.cookies?.token
        if(!token){
            return res.status(400).json({
                success : false,
                message : 'auth failed no token'
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        console.log('auth middleware failure')
        return res.status(400).json({
            success : false,
            message : 'auth middleware failed'
        })
    }
}