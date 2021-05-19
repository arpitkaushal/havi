const mongoose = require("mongoose");

// define various 
const candidateSchema = new mongoose.Schema({
    email: {
        type:String,
        required:true,
        unique:true
    },
    name: {
        type:String,
        required:true
    },
    // password: {
    //     type:String,
    //     required:true
    // },
    // photo:{
    //     type:Buffer,
    //     contenType:String
    // },
    comment: {
        type:String,
        required:true
    }
});

const Candidate = new mongoose.model("Candidates", candidateSchema);
module.exports = Candidate;
