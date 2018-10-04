var express=require("express");
var router=express.Router();
var Question=require("../models/question");
var middleware=require("../middlewares/middleware.js");

router.get("/",function(req,res){
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        
        Question.find({name: regex},function(err,newque){
            if(newque.length<1 || newque==null || newque.length==null){
                req.flash("error","No result available");
                res.redirect("/question");
            }
            else if(err)
                req.flash("error","Opps something went wrong");
            else{
                res.render("questions/index",{que: newque}); 
            }
        });
    }
    else{
        Question.find({},function(err,newque){
            if(err)
                req.flash("error","Opps something went wrong");
            else{
                res.render("questions/index",{que: newque});        
            }
        });
    }
});

router.post("/",middleware.isLoggedIn,function(req,res){
    var name=req.body.name;
    var image=req.body.image;
    var desc=req.body.description;
    var subject=req.body.subject;
    var author={
        id:req.user._id,
        username:req.user.username
    };
    
    var newque={name: name ,image: image,description:desc,author: author,subject: subject};
    Question.create(newque,function(err,que){
        if(err)
            {
                req.flash("error","Oops some error occured");
                res.redirect("back");
            }
        else{
             req.flash("success","New question succesfully added");
             res.redirect("/question");
        }
    });
    });

router.get("/new",middleware.isLoggedIn,function(req,res){
    res.render("questions/addque");

});

router.get("/:id",function(req,res){
    Question.findById(req.params.id).populate("answers").exec(function(err,foundque){
        if(err || !foundque){
            req.flash("error","Oops question not found");
            res.redirect("back");
        }
        else
            res.render("questions/quedetail",{foundque: foundque});
            
    });
});

router.get("/:id/edit",middleware.checkQueOwnership,function(req,res){
    Question.findById(req.params.id,function(err,foundque){
            res.render("questions/edit",{foundque: foundque});
    });
});
router.put("/:id",middleware.checkQueOwnership,function(req,res){
    
    Question.findByIdAndUpdate(req.params.id,req.body.question,function(err,question){
        if(err){
            req.flash("error","Cannot update question");
            res.redirect("/question");
        }
        else{
            req.flash("success","Question updated succesfully");
            res.redirect("/question/"+question._id);
        }
    });
});

router.delete("/:id",middleware.checkQueOwnership,function(req,res){
    Question.findByIdAndRemove(req.params.id,function(err){
        if(err){
            req.flash("error",err);
            res.redirect("/question");
        }
        else{
            req.flash("success","Question deleted succesfully");
            res.redirect("/question");
        }
    });
});

//fuzzy search
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports=router;