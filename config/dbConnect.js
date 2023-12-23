import mongoose from "mongoose";

const dbConnect = async () => {
    try{
        mongoose.set("strictQuery", false);
        const connected = await mongoose.connect(process.env.MONGO_URL,);
        // mongoose.set("strictQuery", true);
        console.log(`mongodb connected ${connected.connection.host}`);
    }
    catch(error){
        console.log(`error : ${error.message}`);
        process.exit(1);
    }
};

export default dbConnect;