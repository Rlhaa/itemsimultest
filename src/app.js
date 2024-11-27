import express from "express";
import cookieParser from "cookie-parser";
import signupRouter from "./routes/signup.router.js";
import signinRouter from "./routes/signin.router.js";
import characterRouter from "./routes/characters.router.js";
import dotenv from "dotenv";

dotenv.config();
console.log(process.env.DATABASE_URL);

const app = express();
const PORT = 3000;

// const ACCESS_TOKEN_SECRET_KEY = `HangHae99`; // Access Token의 비밀 키를 정의합니다.
// const REFRESH_TOKEN_SECRET_KEY = `Sparta`; // Refresh Token의 비밀 키를 정의합니다.

app.use(express.json());
app.use(cookieParser());

app.use("/api", signupRouter);

app.use("/api", signinRouter);

// app.use(authMiddleware);
app.use("/api", characterRouter);

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
});
