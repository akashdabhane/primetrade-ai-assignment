const mongoose = require('mongoose'); 

const connectDB = async() => {
    try {
        // mongodb connection string
        const con = await mongoose.connect('mongodb+srv://akashdabhane10_db_user:vfnHFFEfQS5Kr5ok@cluster0.dqw07tc.mongodb.net/'); 

        console.log(`MongoDB connected: ${con.connection.host}`);
    } catch (error) {
        console.log(error); 
        process.exit(1);    
    }
}


module.exports = connectDB; 