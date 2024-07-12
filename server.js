const dotenv = require("dotenv");
const app = require("./app");
const mongoose = require("mongoose");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE_NAME.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => console.log("connected successfully"));

const port = process.env.PORT || 8000;
app.listen(port, (err) => {
  if (err) return console.log("Error Starting the server");
  console.log(`App running on port ${port}...`);
});
