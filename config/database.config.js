const mongoose = require("mongoose");

let URI = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASSWORD}@${process.env.DBHOST}/${process.env.DBNAME}?retryWrites=true&w=majority`;

if (process.env.DEVICE === "local") {
  URI = "mongodb://localhost:27017/web-experts";
}

mongoose
  .connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`Connected to Mongo Database.`);
  })
  .catch((ex) => {
    console.log("Failed to Connect to Mongo Database.");
    console.error(ex);
  });

module.exports = mongoose;
