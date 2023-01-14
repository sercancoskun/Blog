const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;

//mongoose.connect('mongodb://127.0.0.1:27017/todolistDB');
mongoose.connect(process.env.DB_URL);

const pageSchema = {
    pageTitle: String,
    pageContent: String
};

const Page = mongoose.model("Page", pageSchema);

const home = new Page({
    pageTitle: "Home",
    pageContent: "Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing."
});

const about = new Page({
    pageTitle: "About Me",
    pageContent: "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui."
});

const contact = new Page({
    pageTitle: "Contact Me",
    pageContent:  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero."
});

// Page.insertMany([home, about, contact], (err, pageList) => {
//     if(err){
//         console.log(err);
//     }else{
//         console.log(pageList.pageTitle);
//     }
// });

const postSchema = {
    postTitle: String,
    postContent: String
};

const Post = mongoose.model("Post", postSchema);

const firstPost = new Post({
    postTitle: "Welcome to my blog!",
    postContent: "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing."
});

//firstPost.save();

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public/"));

app.get("/", (req,res) => {

    Page.countDocuments({}, (pageError, totalPage) => {
        if(!pageError && totalPage < 1){

            Post.find({}, (error, posts) => {
                res.render("home", {
                    homeData: {pageTitle: "Home", pageContent: ""},
                    blogData: posts
                });
            });
            
        }else{
            Page.findOne({pageTitle: "Home"}, (err, page) => {
                if(!err && page){

                    Post.find({}, (error, posts) => {
                        res.render("home", {
                            homeData: page,
                            blogData: posts
                        });
                    });

                }
            });
        };
    });
    
});

app.get("/about", (req,res) => {

    Page.countDocuments({}, (pageError, totalPage) => {
        if(!pageError && totalPage < 1){
            res.render("about", {
                aboutData: {pageTitle: "About Me", pageContent: "No content available at the moment."}
            });
        }else{
            Page.findOne({pageTitle: "About Me"}, (err, page) => {
                if(!err && page){
                    res.render("about", {
                        aboutData: page
                    });
                }
            });
        }
    });
    
});

app.get("/contact", (req,res) => {

    Page.countDocuments({}, (pageError, totalPage) => {
        if(!pageError && totalPage < 1){
            res.render("contact", {
                contactData: {pageTitle: "Contact Me", pageContent: "No content available at the moment."}
            });
        }else{
            Page.findOne({pageTitle: "Contact Me"}, (err, page) => {
                if(!err && page){
                    res.render("contact", {
                        contactData: page
                    });
                }
            });
        }
    });
    
});

app.get("/compose", (req,res) => {
    res.render("compose");
});

app.post("/compose", (req,res) => {
    const postTitle = req.body.postTitle;
    const postContent = req.body.postContent;

    const postObject = new Post({
        postTitle: postTitle,
        postContent: postContent
    });

    postObject.save((err) => {
        if(!err){
            res.redirect("/");
        }
    });
});

app.get("/posts", (req,res) => {

    Post.find({}, (err, posts) => {
        if(!err && posts){
            res.render("posts", {
                blogData: posts
            });
        }       
    }); 
});

app.get("/posts/:postID", (req,res) => {

    const postID = req.params.postID;

    Post.findOne({_id: postID}, (err, post) => {
        if(!err && post){
            res.render("post", {
                postData: post
            });
        }else{
            res.render("404");
        };
        
    });

});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}.`);
});