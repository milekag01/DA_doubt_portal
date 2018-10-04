var Question=require("../models/question");
var Answer=require("../models/answer");
var middlewareobj={};

middlewareobj.checkQueOwnership=function(req,res,next){
    if(req.isAuthenticated()){
        Question.findById(req.params.id,function(err,foundque){
            if(err || !foundque){
                req.flash("error","Question not found");
                res.redirect("back");
            }
            else{
                if(foundque.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error","You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error","You must be logged in to do that");
        res.redirect("back");
    }
};

middlewareobj.checkAnswerOwnership=function(req,res,next){
    if(req.isAuthenticated()){
        Answer.findById(req.params.answer_id,function(err,foundanswer){
            if(err || !foundanswer){
                req.flash("error","Answer not found");
                res.redirect("back");
            }
            else{
                if(foundanswer.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error","You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error","You must be logged in to do that");
        res.redirect("back");
    }
};

middlewareobj.isLoggedIn=function(req,res,next){
    if(req.isAuthenticated())
        return next();
    req.flash("error","You must be logged in to do that");
    res.redirect("/login");
};

module.exports=middlewareobj;