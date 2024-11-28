import express from "express";
import { prisma } from "../utils/prisma/index.js";
import dotenv from "dotenv";
import authM from "../middlewares/auth.js";

dotenv.config();
// character.js
const router = express.Router();

router.post("/create-character", authM, async (req, res) => {
  // 요청 본문에서 nickname 추출
  const { nickname } = req.body;
  // authM 미들웨어에서 인증을 거친 accounts 정보를 가져오고
  // accounts에서 account_id를 추출한다
  const { account_id } = req.abc;

  // 닉네임 중복 검증
  const isExistCharacter = await prisma.characters.findFirst({
    where: { nickname },
  });

  if (isExistCharacter) {
    return res.status(409).json({ message: "이미 존재하는 닉네임입니다." });
  }

  // 캐릭터 생성 로직
  const newCharacter = await prisma.characters.create({
    data: {
      // 뽑아온 nickname, account_id를 각 컬럼에 적용한다.
      account_id: account_id,
      nickname: nickname,
      health: 500,
      power: 100,
      money: 10000,
    },
  });
  return res
    .status(201)
    .json({ message: "캐릭터 생성 성공", character: newCharacter });
});

export default router;
