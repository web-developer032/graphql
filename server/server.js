const dotenv = require("dotenv");

dotenv.config();

const app = require("./app");

app.listen(process.env.PORT || 5000, () => {
    console.log(`LISTENING ON PORT: ${process.env.PORT}`);
});
