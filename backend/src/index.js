const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
    path: path.resolve(__dirname, '../../.env')
});

// Verify environment variables are loaded
if (!process.env.ACCESS_TOKEN_SECRET) {
    console.warn('WARNING: ACCESS_TOKEN_SECRET is not defined in environment variables');
}

const app = require('./app');
const connectDB = require('../src/database/connection');
const PORT = process.env.PORT || 8000;

// mongodb connecction
connectDB();

app.listen(PORT, () => {
    console.log(`server is running of port ${PORT}`);
})