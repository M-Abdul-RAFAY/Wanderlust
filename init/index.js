const mongoose = require("mongoose");
const dataset = require("./data");
const Listing = require("../model/listing");
const { object } = require("joi");

async function main() {
  await mongoose.connect(
    "mongodb+srv://muhammadabdulrafay1:P08JfclddpJTRsg8@wandarlust.ihz1r.mongodb.net/?retryWrites=true&w=majority&appName=WandarLust"
  );
}

main()
  .then(() => {
    console.log("connected to the mongodb server");
  })
  .catch((err) => {
    console.log(err);
  });

const initDB = async () => {
  await Listing.deleteMany({});
  dataset.data = dataset.data.map((obj) => ({
    ...obj,
    owner: "67c204c3bb14b0e10bfa4214",
  }));
  await Listing.insertMany(dataset.data);
  console.log("The data have been inserted");
};

initDB();
