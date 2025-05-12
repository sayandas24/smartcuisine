import app from "./app.js";
import "dotenv/config";

app.listen(process.env.PORT || 8080, () => {
  console.log(
    `Server has started : http://localhost:${process.env.PORT || 8080}`
  );
});
