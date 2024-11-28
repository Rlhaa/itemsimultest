import express from "express";
import { prisma } from "../utils/prisma/index.js";

const router = express.Router();

router.post("/create-item", async (req, res) => {
  // 요청 본문에서 nickname 추출
  const { item_code, item_name, item_stat, item_price } = req.body;
  // authM 미들웨어에서 인증을 거친 accounts 정보를 가져오고
  // accounts에서 account_id를 추출한다

  // 닉네임 중복 검증
  const isExistCode = await prisma.item.findFirst({
    where: { item_code },
  });

  if (isExistCode) {
    return res.status(409).json({ message: "이미 존재하는 아이템입니다." });
  }

  // 캐릭터 생성 로직
  const newItem = await prisma.item.create({
    data: {
      // 뽑아온 nickname, account_id를 각 컬럼에 적용한다.
      item_code: item_code,
      item_name: item_name,
      item_stat: item_stat,
      item_price: item_price,
    },
  });
  return res.status(201).json({ message: "아이템 생성 성공", item: newItem });
});

export default router;
