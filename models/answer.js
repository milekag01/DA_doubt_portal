var mongoose=require("mongoose");

var answerSchema=new mongoose.Schema({
    text:String,
    author:{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

var Answer=mongoose.model("Answer",answerSchema);

module.exports=Answer;
