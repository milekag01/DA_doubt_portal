var express=require("express");
var router=express.Router();
var Blog=require("../models/blog");
var middleware=require("../middlewares/middleware.js");

router.get("/",function(req,res){
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        
        Blog.find({name: regex},function(err,newblog){
            if(newblog.length<1 || newblog==null || newblog.length==null){
                req.flash("error","No result available");
                res.redirect("/blog");
            }
            else if(err)
                req.flash("error","Opps something went wrong");
            else{
                res.render("blogs/index",{blog: newblog}); 
            }
        });
    }
    else{
        Blog.find({},function(err,newblog){
            if(err)
                req.flash("error","Opps something went wrong");
            else{
                res.render("blogs/index",{blog: newblog});        
            }
        });
    }
});

router.post("/",middleware.isLoggedIn,function(req,res){
    var name=req.body.name;
    var image=req.body.image;
    var desc=req.body.description;
    var author={
        id:req.user._id,
        username:req.user.username
    };
    
    var newblog={name: name ,image: image,description:desc,author: author};
    Blog.create(newblog,function(err,blog){
        if(err)
            {
                req.flash("error","Oops some error occured");
                res.redirect("back");
            }
        else{
             req.flash("success","New blog succesfully added");
             res.redirect("/blog");
        }
    });
    });

router.get("/new",middleware.isLoggedIn,function(req,res){
    res.render("blogs/addblog");

});

router.get("/:id",function(req,res){
    Blog.findById(req.params.id).exec(function(err,foundblog){
        if(err || !foundblog){
            req.flash("error","Oops blog not found");
            res.redirect("back");
        }
        else
            res.render("blogs/blogdetail",{foundblog: foundblog});
            
    });
});

router.get("/:id/edit",middleware.checkBlogOwnership,function(req,res){
    Blog.findById(req.params.id,function(err,foundblog){
            res.render("blogs/edit",{foundblog: foundblog});
    });
});
router.put("/:id",middleware.checkBlogOwnership,function(req,res){
    
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,blog){
        if(err){
            req.flash("error","Cannot update blog");
            res.redirect("/blog");
        }
        else{
            req.flash("success","Blog updated succesfully");
            res.redirect("/blog/"+blog._id);
        }
    });
});

router.delete("/:id",middleware.checkBlogOwnership,function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            req.flash("error",err);
            res.redirect("/blog");
        }
        else{
            req.flash("success","Blog deleted succesfully");
            res.redirect("/blog");
        }
    });
});

//fuzzy search
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports=router;