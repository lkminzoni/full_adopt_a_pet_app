const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;
const UserRoutes = require("./routes/UserRoutes");
const PetRoutes = require("./routes/PetRoutes");

app.use(express.json());

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.use(express.static("public"));

// Routes
app.use("/users", UserRoutes);
app.use("/pets", PetRoutes);

app.listen(PORT, () => {
  console.log("Listening On Port " + PORT);
});
