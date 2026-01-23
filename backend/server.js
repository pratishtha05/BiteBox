const app = require("./app");
const dbConnection = require("./config/db");

const PORT = process.env.PORT || 3000;

dbConnection();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
