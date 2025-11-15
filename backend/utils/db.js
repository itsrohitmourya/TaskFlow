import mongoose from "mongoose";

const db = ()=>{
    mongoose.connect(process.env.MONGO_URL)
    .then(()=>{
        console.log("database is connected")
    })
    .catch(()=>{
        console.log('error in connecting database')
    })
}

export default db