const mongoose = require("mongoose");
const initData=require("./data.js");
const Listing=require("../model/listening.js");

let mongoUrl="mongodb://127.0.0.1:27017/wanderlust";

main()
  .then((res) => {
    console.log("congretulation!!");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongoUrl);
}

const initDb=async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,onwer:'6657d0ec72135a885c543d98'}))
    await Listing.insertMany(initData.data);
    console.log("data was inserted");
}

initDb();
