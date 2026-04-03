require("dotenv").config();
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing");
const maptilerClient = require("@maptiler/client");

maptilerClient.config.apiKey = process.env.MAP_TOCKEN;

// MongoDb connection
const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
    await mongoose.connect(dbUrl);
}

const initDB = async () => {
    await Listing.deleteMany({});
    
    for (let obj of initData.data) {
        let response = await maptilerClient.geocoding.forward(obj.location, {
            limit: 1
        });
        obj.geometry = response.features[0].geometry;
        obj.owner = "69cf6771fdd043c2643bb08c";
    }

    await Listing.insertMany(initData.data);
    console.log("Data was initialised with geometry!");
};
initDB();