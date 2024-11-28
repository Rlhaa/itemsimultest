import express from "express";
import cookieParser from "cookie-parser";
import signupRouter from "./routes/signup.router.js";
import signinRouter from "./routes/signin.router.js";
import characterRouter from "./routes/characters.router.js";
import deleteRouter from "./routes/delete.router.js";
import searchRouter from "./routes/search.router.js";
import itemRouter from "./routes/item.router.js";
import dotenv from "dotenv";

dotenv.config();
console.log(process.env.DATABASE_URL);

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());

app.use("/api", signupRouter);

app.use("/api", signinRouter);

// app.use(authMiddleware);
app.use("/api", characterRouter);

app.use("/api", deleteRouter);

app.use("/api", searchRouter);

app.use("/api", itemRouter);

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
});
