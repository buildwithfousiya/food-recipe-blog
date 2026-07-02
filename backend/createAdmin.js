/**
 * createAdmin.js — Run this script ONCE to create an admin account.
 * 
 * Usage:
 *   node createAdmin.js
 * 
 * You can change the USERNAME and PASSWORD values below before running.
 */

require("dotenv").config()
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const Admin = require("./models/admin")

// ─── Configure your admin credentials here ──────────────────────────────────
const USERNAME = "admin"
const PASSWORD = "admin123"
// ─────────────────────────────────────────────────────────────────────────────

const run = async () => {
    try {
        await mongoose.connect(process.env.CONNECTION_STRING)
        console.log("✅ Database connected")

        const existing = await Admin.findOne({ username: USERNAME })
        if (existing) {
            console.log(`⚠️  Admin "${USERNAME}" already exists. No changes made.`)
            process.exit(0)
        }

        const hashedPassword = await bcrypt.hash(PASSWORD, 10)
        await Admin.create({ username: USERNAME, password: hashedPassword })

        console.log(`✅ Admin created successfully!`)
        console.log(`   Username : ${USERNAME}`)
        console.log(`   Password : ${PASSWORD}`)
        process.exit(0)

    } catch (err) {
        console.error("❌ Error:", err.message)
        process.exit(1)
    }
}

run()
