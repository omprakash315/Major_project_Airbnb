if(process.env.NODE_ENV!="production"){
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing=require("./model/listening.js");
const path=require("path");
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const wrapAsync=require("./utelity/wrapAsync.js");
const ExpressError=require("./utelity/ExpressError.js");
const validationschema=require("./schema.js");
const Review=require("./model/review.js")
const linstingroute=require("./route/listings.js");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const user = require("./model/user.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const userroute=require("./route/user.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs', engine);
app.use(express.static(path.join(__dirname,"public")));


// let mongoUrl="mongodb://127.0.0.1:27017/wanderlust";

const DBURL=process.env.DBATLASURL;

main()
  .then((res) => {
    console.log("congretulation!!");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(DBURL);
}

const store= MongoStore.create({
  mongoUrl: DBURL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter:24*3600,
});

store.on("error",()=>{
  console.log("error in mongostore",err);
});

const sessionOPtion={
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
}

// app.get("/",(req,res)=>{
//     res.send("Hi... I am root");
// });

app.use(session(sessionOPtion));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));


passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
});

app.use("/listings",linstingroute);
app.use("/",userroute);

// reviews post rout
app.post("/listings/:id/reviews",(async (req,res)=>{
  let listing=await Listing.findById(req.params.id);
  let newListing=new Review(req.body.review);
  listing.review.push(newListing);
  await newListing.save();
  await listing.save();
  console.log(newListing);
  res.send("saved");
}));

// app.get("/tesListing",async (req,res)=>{
//     const sampleListing=new Listening(
//         {
//             title:"My New Vella",
//             description:"By the beach",
//             price:1200,
//             location:"Calangute,Goa",
//             country:"India",
//         }
//     );
//     await sampleListing.save();
//     console.log("data saved");
//     res.send("succesfule");
// })

app.get("*",(req,res,next)=>{
  next(new ExpressError(404,"Page was not found"));
})



app.use((err,req,res,next)=>{
  let {status=500,message="somthing went wrong"}=err;
  res.render("error.ejs",{message});
})

app.listen("8080", () => {
  console.log("app is listening ! ");
});
