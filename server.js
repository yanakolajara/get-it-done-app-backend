const app = require("./app");
require("dotenv").config();

const PORT = process.env.PORT || 3015;

app.listen(PORT, () => {
  console.log(`Server running at port: ${PORT}`);
});
