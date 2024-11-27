import express from "express";
import { prisma } from "../utils/prisma/index.js";
import bcrypt from "bcrypt";

const router = express.Router();

/** 사용자 회원가입 API **/
// localhost:c/api/sign-up POST
router.post("/sign-up", async (req, res) => {
  const { email, id, password, name, age, gender } = req.body;

  // 이메일 중복 체크
  const isExistEmail = await prisma.accounts.findUnique({
    where: { email },
  });

  if (isExistEmail) {
    return res.status(409).json({ message: "이미 존재하는 이메일입니다." });
  }

  const isExistId = await prisma.accounts.findUnique({
    where: { id },
  });

  if (isExistId) {
    return res.status(409).json({ message: "이미 존재하는 id입니다." });
  }

  const idForm = /^[a-z0-9]+$/;
  if (!idForm.test(id)) {
    return res
      .status(409)
      .json({ message: "id는 영어(소문자)와 숫자로만 설정해야 합니다" });
  }

  const passwrodForm = /^.{1,6}$/;
  if (!passwrodForm.test(password)) {
    return res
      .status(409)
      .json({ message: "password는 6자리 이하로만 설정할 수 있습니다" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // 사용자 정보를 Accounts 테이블에 추가
  const newAccount = await prisma.accounts.create({
    data: {
      email,
      id,
      password: hashedPassword,
      name,
      age,
      gender: gender.toUpperCase(),
    },
  });

  return res.status(201).json({
    message: "회원가입이 완료되었습니다.",
    account_id: newAccount.account_id,
  });
});

export default router;
