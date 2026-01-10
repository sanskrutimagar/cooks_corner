const mongoose = require("mongoose")
const dotenv = require('dotenv');
dotenv.config();



const url = process.env.MONGO_URI

const connectToMongoDb =()=> {
    mongoose.connect(url, { useNewUrlParser: true }).then(() => console.log("connection successfull...."))
.catch((err) => console.log(err));
}

//exporting mongose
module.exports = connectToMongoDb;