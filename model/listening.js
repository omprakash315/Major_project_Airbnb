const mongoose = require("mongoose");
const Schema=mongoose.Schema;

const listeningSchema=new mongoose.Schema(
    {
        title:{
            type:String,
            required:true
        },
        description:String,
        image:{
            url:String,
            filename:String,
        },
        price:Number,
        location:String,
        country:String,
        review:{
            type:Schema.Types.ObjectId,
            ref:"Review",
        }
    }
);

let Listening=mongoose.model("Listening",listeningSchema);
module.exports=Listening;