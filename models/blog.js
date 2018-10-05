var mongoose=require("mongoose");

var blogSchema=new mongoose.Schema({
    name:String,
    image:String,
    description:String,
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username: String
    }
});

var Blog=mongoose.model("Blog",blogSchema);

module.exports=Blog;