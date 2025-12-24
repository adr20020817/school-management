import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ========== MySQL CONNECTION ==========
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "TEM2WCRSAM@",
  database: process.env.DB_NAME || "education_sphere",
  waitForConnections: true,
  connectionLimit: 10,
});

// Ensure auth and domain tables exist
async function initDb() {
  const createUsersTableSql = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('student','teacher') NOT NULL,
      reset_otp VARCHAR(10),
      reset_otp_expires DATETIME,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
  `;

  const createStudentsTableSql = `
    CREATE TABLE IF NOT EXISTS students (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL UNIQUE,
      regNo VARCHAR(50) UNIQUE,
      class_name VARCHAR(100),
      attendance_percent DECIMAL(5,2),
      score INT,
      grade VARCHAR(2),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_students_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
    ) ENGINE=InnoDB;
  `;

  const createTeachersTableSql = `
    CREATE TABLE IF NOT EXISTS teachers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_teachers_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
    ) ENGINE=InnoDB;
  `;

  try {
    const connection = await pool.getConnection();
    await connection.query(createUsersTableSql);
    await connection.query(createStudentsTableSql);
    await connection.query(createTeachersTableSql);
    
    // Add OTP columns to users table if they don't exist (for existing databases)
    try {
      await connection.query(`
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS reset_otp VARCHAR(10) NULL,
        ADD COLUMN IF NOT EXISTS reset_otp_expires DATETIME NULL
      `);
    } catch (alterErr) {
      // MySQL doesn't support IF NOT EXISTS in ALTER TABLE, so check error
      if (alterErr.code !== 'ER_DUP_FIELDNAME') {
        // Try adding columns one by one (MySQL 8.0.19+ supports IF NOT EXISTS, older versions don't)
        try {
          await connection.query(`ALTER TABLE users ADD COLUMN reset_otp VARCHAR(10) NULL`);
        } catch (e) {
          if (e.code !== 'ER_DUP_FIELDNAME') console.warn("Could not add reset_otp column:", e.message);
        }
        try {
          await connection.query(`ALTER TABLE users ADD COLUMN reset_otp_expires DATETIME NULL`);
        } catch (e) {
          if (e.code !== 'ER_DUP_FIELDNAME') console.warn("Could not add reset_otp_expires column:", e.message);
        }
      }
    }
    
    // Add academic columns to students table if they don't exist
    try {
      await connection.query(`ALTER TABLE students ADD COLUMN class_name VARCHAR(100) NULL`);
    } catch (e) {
      if (e.code !== 'ER_DUP_FIELDNAME') console.warn("Could not add class_name column:", e.message);
    }
    try {
      await connection.query(`ALTER TABLE students ADD COLUMN attendance_percent DECIMAL(5,2) NULL`);
    } catch (e) {
      if (e.code !== 'ER_DUP_FIELDNAME') console.warn("Could not add attendance_percent column:", e.message);
    }
    try {
      await connection.query(`ALTER TABLE students ADD COLUMN score INT NULL`);
    } catch (e) {
      if (e.code !== 'ER_DUP_FIELDNAME') console.warn("Could not add score column:", e.message);
    }
    try {
      await connection.query(`ALTER TABLE students ADD COLUMN grade VARCHAR(2) NULL`);
    } catch (e) {
      if (e.code !== 'ER_DUP_FIELDNAME') console.warn("Could not add grade column:", e.message);
    }
    
    connection.release();
    console.log("✅ Connected to MySQL and ensured users/students/teachers tables exist");
  } catch (err) {
    console.error("MySQL connection/table error:", err.message);
    process.exit(1);
  }
}

initDb();

// Helper to generate student registration number
function generateStudentRegNo() {
  return `STD-${Math.floor(1000 + Math.random() * 9000)}`;
}

// Helper to calculate grade based on score
function calculateGrade(score) {
  if (score == null || Number.isNaN(score)) return null;
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  if (score >= 50) return "E";
  if (score >= 40) return "S";
  if (score >= 30) return "F";
  return "F";
}

// Helper to generate numeric OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
}

// Email transporter (lazy initialization)
function getTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("⚠️  SMTP configuration missing. Email sending will be disabled.");
    return null;
  }
  
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// ========== REGISTER ==========
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const connection = await pool.getConnection();

    // Check if email already exists in users table
    const [existingRows] = await connection.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingRows.length > 0) {
      connection.release();
      return res.status(409).json({ message: "Email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await connection.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role]
    );

    const userId = result.insertId;

    let regNo = null;

    if (role === "student") {
      regNo = generateStudentRegNo();
      await connection.query(
        "INSERT INTO students (user_id, regNo) VALUES (?, ?)",
        [userId, regNo]
      );
    } else if (role === "teacher") {
      await connection.query(
        "INSERT INTO teachers (user_id) VALUES (?)",
        [userId]
      );
    }

    connection.release();

    const safeUser = {
      id: userId,
      name,
      email,
      role,
      regNo,
    };

    return res.status(201).json(safeUser);
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error during registration" });
  }
});

// ========== REQUEST PASSWORD RESET (OTP) ==========
app.post("/api/auth/request-reset", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const connection = await pool.getConnection();

    const [rows] = await connection.query("SELECT id, name, email FROM users WHERE email = ?", [email]);

    if (rows.length === 0) {
      connection.release();
      // Do not reveal whether email exists for security; but here we can just say ok
      return res.json({ message: "If the email exists, an OTP has been sent" });
    }

    const user = rows[0];
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await connection.query(
      "UPDATE users SET reset_otp = ?, reset_otp_expires = ? WHERE id = ?",
      [otp, expiresAt, user.id]
    );

    connection.release();

    // Send OTP via email
    const transporter = getTransporter();
    if (transporter) {
      try {
        await transporter.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: user.email,
          subject: "ElimuSphere Password Reset OTP",
          text: `Hello ${user.name},\n\nYour password reset OTP is: ${otp}\nIt will expire in 15 minutes.\n\nIf you did not request this, please ignore this email.`,
        });
        console.log(`✅ OTP sent to ${user.email}`);
      } catch (emailErr) {
        console.error("Failed to send email:", emailErr.message);
        // Still return success to user (OTP is saved in DB, they can check console/logs)
      }
    } else {
      // If SMTP not configured, log OTP to console for development
      console.log(`\n📧 OTP for ${user.email}: ${otp}\n(Email not configured - check server logs)\n`);
    }

    return res.json({ message: "If the email exists, an OTP has been sent" });
  } catch (err) {
    console.error("Request reset error:", err);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
});

// ========== CONFIRM OTP & RESET PASSWORD ==========
app.post("/api/auth/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP and new password are required" });
    }

    const connection = await pool.getConnection();

    const [rows] = await connection.query(
      "SELECT id, reset_otp, reset_otp_expires FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      connection.release();
      return res.status(400).json({ message: "Invalid OTP or email" });
    }

    const user = rows[0];

    if (!user.reset_otp || user.reset_otp !== otp) {
      connection.release();
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const now = new Date();
    const expires = new Date(user.reset_otp_expires);
    if (now > expires) {
      connection.release();
      return res.status(400).json({ message: "OTP has expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await connection.query(
      "UPDATE users SET password = ?, reset_otp = NULL, reset_otp_expires = NULL WHERE id = ?",
      [hashedPassword, user.id]
    );

    connection.release();

    return res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({ message: "Failed to reset password" });
  }
});

// ========== STUDENTS LIST ==========
app.get("/api/students", async (_req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      `SELECT s.id AS studentId,
              u.name,
              u.email,
              s.regNo,
              s.class_name AS className,
              s.attendance_percent AS attendancePercent,
              s.score,
              s.grade
       FROM students s
       JOIN users u ON s.user_id = u.id
       ORDER BY u.name ASC`
    );
    connection.release();
    return res.json(rows);
  } catch (err) {
    console.error("Fetch students error:", err);
    return res.status(500).json({ message: "Failed to fetch students" });
  }
});

// ========== UPDATE STUDENT RECORD ==========
app.put("/api/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { className, attendancePercent, score } = req.body;

    const grade = calculateGrade(Number(score));

    const connection = await pool.getConnection();
    await connection.query(
      `UPDATE students
       SET class_name = ?, attendance_percent = ?, score = ?, grade = ?
       WHERE id = ?`,
      [className || null, attendancePercent ?? null, score ?? null, grade, id]
    );

    const [rows] = await connection.query(
      `SELECT s.id AS studentId,
              u.name,
              u.email,
              s.regNo,
              s.class_name AS className,
              s.attendance_percent AS attendancePercent,
              s.score,
              s.grade
       FROM students s
       JOIN users u ON s.user_id = u.id
       WHERE s.id = ?`,
      [id]
    );

    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.json(rows[0]);
  } catch (err) {
    console.error("Update student error:", err);
    return res.status(500).json({ message: "Failed to update student" });
  }
});

// ========== LOGIN ==========
app.post("/api/login", async (req, res) => {
  try {
    const { identifier, password, role } = req.body;

    if (!identifier || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const connection = await pool.getConnection();

    let rows;

    if (role === "student") {
      // Students can log in using email or regNo
      [rows] = await connection.query(
        `SELECT u.id, u.name, u.email, u.password, u.role, s.regNo
         FROM users u
         JOIN students s ON s.user_id = u.id
         WHERE u.role = 'student' AND (u.email = ? OR s.regNo = ?)`,
        [identifier, identifier]
      );
    } else if (role === "teacher") {
      // Teachers log in using email (can extend later with staff number)
      [rows] = await connection.query(
        `SELECT u.id, u.name, u.email, u.password, u.role, NULL AS regNo
         FROM users u
         WHERE u.role = 'teacher' AND u.email = ?`,
        [identifier]
      );
    } else {
      connection.release();
      return res.status(400).json({ message: "Unsupported role" });
    }

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    connection.release();
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      regNo: user.regNo,
    };

    return res.json(safeUser);
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error during login" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


