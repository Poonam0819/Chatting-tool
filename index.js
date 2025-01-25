const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chats.js");
const methodOverride = require("method-override");
const ExpressError = require("./ExpressError");

app.set("views", path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));

main()
.then(res => console.log("connection successfull"))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/fakeWhatsapp');
};

//Index Route
app.get("/chats", asyncWrap (async (req, res) => {
  let chats = await Chat.find();
  // console.log(chats);
  res.render("index.ejs" , {chats});
}));

//new chat route
app.get("/chats/new", (req,res) => {
  throw new ExpressError(404, "Page Not Found");
  res.render("new.ejs");
});

//create route
app.post("/chats", asyncWrap (async (req, res, next) => {
  console.log(req);

  let { from , msg , to } = req.body;
  let newChat = new Chat({
    from : from,
    to : to,
    msg : msg,
    created_at : new Date(),
  });
  
  await newChat.save()
  res.redirect("/chats");
}));

function asyncWrap(fn){
  return function(req, res, next){
    fn(req, res, next).catch((err) => next(err));
  }
}

//New - Show  route
app.get("/chats/:id", asyncWrap (async (req, res, next) => {
  let {id} = req.params;
  let chat = await Chat.findById(id);
  if(!chat){
    next(new ExpressError(500, "Chat Not Found"));
  }
  res.render("edit.ejs",{chat});
}));

//Edit route
app.get("/chats/:id/edit", asyncWrap (async (req, res) => {
  let {id} = req.params;
  let chat = await Chat.findById(id);
  res.render("edit.ejs",{chat});
}));

// Update route
app.put("/chats/:id", asyncWrap (async (req, res) => {
  let {id} = req.params;
  let {msg : newMsg} = req.body;
  let updatedMsg = await Chat.findByIdAndUpdate(id,{msg : newMsg},
    {runValidators : true}, {new : true}
  );
  console.log(updatedMsg);
  res.redirect("/chats");
}));

//delete route
app.delete("/chats/:id", asyncWrap (async (req, res) =>{
  let {id} = req.params;
  let deletedMsg = await Chat.findByIdAndDelete(id);
  console.log(deletedMsg);
  res.redirect("/chats");
}));

app.get("/", (req,res) => {
    res.send("root is working");
});

app.use((err, req, res, next) => {
  console.log(err.name);
  next(err);
})

//Error Handling Middleware
app.use((err, req, res, next) => {
  let {status = 500, message ="Some Error Occured"} = err;
  res.status(status).send(message);
});

app.listen(8080, () => {
    console.log("server is listening on port 8080");
});