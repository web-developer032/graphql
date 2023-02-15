require("dotenv").config();

const colors = require("colors");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const app = require("./app");

(async () => {
    try {
        await mongoose.connect(process.env.MONGODB);

        console.log("DATABASE CONNECTED".bgGreen.underline.bold);

        app.listen(process.env.PORT || 5000, () => {
            console.log(`LISTENING ON PORT: ${process.env.PORT}`.bgCyan.underline.bold);
        });
    } catch (error) {
        console.log("ERROR WHILE CONNECTING DATABASE OR SERVER: ".red.underline.bold, error);
    }
})();
