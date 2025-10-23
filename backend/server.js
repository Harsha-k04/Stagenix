import express from "express";
import path from "path";
const app = express();
const __dirname = path.resolve();

// ✅ Serve frontend files
app.use(express.static(path.join(__dirname, "backend/public")));

// ✅ Serve assets (like your 3D model)
app.use("/assets", express.static(path.join(__dirname, "assets")));

// ✅ Default route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "backend/public/index.html"));
});

// ✅ Run the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
