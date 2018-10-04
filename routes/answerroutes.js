var express=require("express");
var router=express.Router({mergeParams:true});
var Question=require("../models/question");
var Answer=require("../models/answer");
var middleware=require("../middlewares/middleware.js");

//answers
router.get("/new",middleware.isLoggedIn,function(req,res){
    Question.findById(req.params.id,function(err,question){
        if(err){
            req.flash("error","Oops something went wrong");
            res.redirect("back");
        }
        else
            res.render("answers/new",{question: question});
    });   
});

router.post("/",middleware.isLoggedIn,function(req,res){
    Question.findById(req.params.id,function(err, question) {
        if(err)
            req.flash("error","Oops something went wrong");
        else
            {
                Answer.create(req.body.answer,function(err,answer){
                    if(err)
                        console.log(err);
                    else
                    {
                        answer.author.id=req.user._id;
                        answer.author.username=req.user.username;
                        answer.save();
                        question.answers.push(answer);
                        question.save();
                        req.flash("success","Answer added succesfully");
                        res.redirect("/question/"+question._id);
                    }
                });
            }
    });
});

router.get("/:answer_id/edit",middleware.checkAnswerOwnership,function(req,res){
    Question.findById(req.params.id,function(err, foundque) {
        if(err || !foundque)
        {
            req.flash("error","No Question found");
            return res.redirect("back");
        }
        Answer.findById(req.params.answer_id,function(err,foundanswer){
        if(err){
            req.flash("error","Oops something went wrong");
            res.redirect("back");
        }
        else
            res.render("answers/edit",{question_id:req.params.id,foundanswer: foundanswer});
        
        });
    });
});

router.put("/:answer_id",middleware.checkAnswerOwnership,function(req,res){
    Answer.findByIdAndUpdate(req.params.answer_id,req.body.answer,function(err,updatedanswer){
        if(err){
            req.flash("error","Oops something went wrong");
            res.redirect("back");
        }
        else{
            req.flash("success","Answer updated succesfully");
            res.redirect("/question/"+req.params.id);
        }
    });
});

router.delete("/:answer_id",middleware.checkAnswerOwnership,function(req,res){
    Answer.findByIdAndRemove(req.params.answer_id,function(err){
        if(err){
            req.flash("error","Oops something went wrong");
            res.redirect("back");
        }
        else{
            req.flash("success","Answer deleted succesfully");
            res.redirect("/question/"+req.params.id);
        }
    });
});

module.exports=router;