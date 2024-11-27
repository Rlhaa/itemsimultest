import express from "express";
import { prisma } from "../utils/prisma/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/sign-in", async (req, res) => {
  const { id, password } = req.body;
  const accounts = await prisma.accounts.findFirst({ where: { id } });

  if (!accounts)
    return res.status(401).json({ message: "존재하지 않는 id입니다." });
  // 입력받은 사용자의 비밀번호와 데이터베이스에 저장된 비밀번호를 비교합니다.
  else if (!(await bcrypt.compare(password, accounts.password)))
    return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });

  // 로그인에 성공하면, 사용자의 userId를 바탕으로 토큰을 생성합니다.
  const token = jwt.sign(
    {
      account_id: accounts.account_id,
    },
    // JWT를 서명하는 데 사용되는 비밀 키
    // 서버가 비밀 키를 사용하여 토큰 변조 여부를 알 수 있다
    "server-secret-key",
    { expiresIn: "1h" }
  );
  return res.status(200).json({ message: "로그인 성공", token });
});
export default router;
