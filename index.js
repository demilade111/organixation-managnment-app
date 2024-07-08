require("dotenv").config();
const express = require("express");

const authRoutes = require("./src/routes/authRoutes");
const organisationRoutes = require("./src/routes/organisationRoutes");
const userRoutes = require("./src/routes/userRoutes");
const { sequelize } = require("./src/models");

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get("/", (req, res) => {
  res.send("Hello to HNG internship");
});

// API routes
app.use("/auth", authRoutes);
app.use("/api/organisations", organisationRoutes);
app.use("/api/users", userRoutes);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected...");

    await sequelize.sync({ alter: true }); // Ensure models are synchronized with the database
    console.log("Database synchronized...");

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use`);
      } else {
        console.error("Server error:", err);
      }
    });
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

startServer();

module.exports = app;
