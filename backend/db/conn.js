const mongoose = require("mongoose");
require("dotenv").config();

async function main() {
  await mongoose.connect(process.env.SERVER);
  console.log("Database Connected");
}

main().catch((err) => console.log(err));

module.exports = mongoose;
