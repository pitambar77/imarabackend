import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import Admin from "./models/Admin.js";

dotenv.config();

const admins = [
  {
    username: "admin",
    email: "mwsplpitambar@gmail.com",
    password: "admin123",
    role: "superadmin",
  },
  {
    username: "imara",
    email: "gourisankarmwspl@gmail.com",
    password: "kileleni!23",
    role: "admin",
  },
];

const createAdmins = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected");

    for (let adminData of admins) {
      const existingAdmin = await Admin.findOne({
        $or: [
          { username: adminData.username },
          { email: adminData.email },
        ],
      });

      if (existingAdmin) {
        console.log(`⚠ ${adminData.username} already exists`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(
        adminData.password,
        10
      );

      await Admin.create({
        username: adminData.username,
        email: adminData.email,
        password: hashedPassword,
        role: adminData.role,
      });

      console.log(`✅ ${adminData.username} created successfully`);
    }

    process.exit();
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

createAdmins();