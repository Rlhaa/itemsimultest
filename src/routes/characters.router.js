import express from "express";
import { prisma } from "../utils/prisma/index.js";
import dotenv from "dotenv";
import authM from "../middlewares/auth.js";

dotenv.config();
// character.js
const router = express.Router();

router.post("/create-character", authM, async (req, res) => {
  const { nickname } = req.body;
  const accounts = req.accounts;
  const { account_id } = accounts;
  const isExistCharacter = await prisma.characters.findFirst({
    where: { nickname },
  });

  if (isExistCharacter) {
    return res.status(409).json({ message: "이미 존재하는 닉네임입니다." });
  }

  // 캐릭터 생성 로직
  const newCharacter = await prisma.characters.create({
    data: {
      account_id,
      nickname,
      health: 10,
      power: 10,
      money: 10,
    },
  });
  return res
    .status(201)
    .json({ message: "캐릭터 생성 성공", character: newCharacter });
});

export default router;
