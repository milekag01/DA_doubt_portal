var mongoose=require("mongoose");

var questionSchema=new mongoose.Schema({
    name:String,
    image:String,
    subject: String,
    description:String,
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username: String
    },
    answers:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Answer"
        }
    ]
});

var Question=mongoose.model("Question",questionSchema);

module.exports=Question;