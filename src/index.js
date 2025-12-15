import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from './db/index.js'
import travelguideRoutes from './routes/travelguideRoutes/travelguideRoutes.js'
import packageRoutes from './routes/packageRoutes/packageRoutes.js'
import destinationdetailsRoutes from "./routes/destinationdetailsRoutes/destinationdetailsRoutes.js";
import destinationlandingRoutes from './routes/destinationlandingRoutes/destinationlandingRoutes.js'
import travelgroupRoutes from "./routes/travelgroupRoutes/travelgroupRoutes.js";
import sustanbilityRoutes from "./routes/sustanbilityRoutes/sustanbilityRoutes.js"
import teamRoutes from "./routes/teamRoutes/teamRoutes.js"
import aboutRoutes from "./routes/aboutRoutes/aboutRoutes.js"
import fleetRoutes from "./routes/fleetRoutes/fleetRoutes.js"
import kilimanjarolandingRoutes from "./routes/kilimanjarolandingRoutes/kilimanjarolandingRoutes.js"

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", travelguideRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/destinationdetails", destinationdetailsRoutes);
app.use("/api/destinationlanding", destinationlandingRoutes);
app.use("/api/travelgroup", travelgroupRoutes);
app.use("/api/sustanbility", sustanbilityRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/fleet",fleetRoutes);
app.use("/api/kilimanjarolanding",kilimanjarolandingRoutes)



connectDB()
const PORT = process.env.PORT || 8000
app.listen(PORT, () => console.log(`Server running on ${PORT}`))

app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});