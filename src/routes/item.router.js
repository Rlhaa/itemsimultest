import express from "express";
import { prisma } from "../utils/prisma/index.js";

const router = express.Router();

router.post("/create-item", async (req, res) => {
  const { item_code, item_name, item_stat, item_price } = req.body;

  const isExistCode = await prisma.item.findFirst({
    where: { item_code },
  });

  if (isExistCode) {
    return res.status(409).json({ message: "이미 존재하는 아이템입니다." });
  }

  const newItem = await prisma.item.create({
    data: {
      item_code: item_code,
      item_name: item_name,
      item_stat: item_stat,
      item_price: item_price,
    },
  });
  return res.status(201).json({ message: "아이템 생성 성공", item: newItem });
});

router.patch("/fix-item/:item_code", async (req, res) => {
  // 요청 본문에서 아이템 코드 추출
  const { item_code } = req.params;
  console.log(item_code);
  const { item_name, item_stat } = req.body;

  const selectedItem = await prisma.item.findFirst({
    where: { item_code: parseInt(item_code, 10) },
  });

  if (!selectedItem) {
    return res
      .status(404)
      .json({ errorMessage: "존재하지 않는 아이템 데이터입니다." });
  }

  const fixedItem = await prisma.item.update({
    where: { item_code: parseInt(item_code, 10) },
    data: {
      // 뽑아온 item_name, item_stat를 각 컬럼에 적용한다.
      item_name: item_name,
      item_stat: item_stat,
    },
  });
  return res.status(201).json({ message: "아이템 수정 성공", item: fixedItem });
});

router.get("/list_search", async (req, res, next) => {
  const items = await prisma.item.findMany({
    select: {
      item_code: true,
      item_name: true,
      item_price: true,
    },
    orderBy: {
      item_code: "desc", // 아이템 코드를 내림차순으로 정렬
    },
  });

  return res.status(200).json({ data: items });
});

router.get("/item_search/:item_code", async (req, res, next) => {
  // req.params에서 item_code 추출
  const { item_code } = req.params;

  // 특정 조건에 맞는 캐릭터는 MyCharacter
  const itemDetail = await prisma.item.findFirst({
    // 그 조건은 item 테이블의 item_code 컬럼에
    // 요청된 item_code 있는지 확인
    // +item_code +는 문자열을 숫자로 변환하는 방법중 하나
    // item_code 파라미터로 전달되는데, 이때 문자열로 전달된다.
    // item_code 숫자형태이기 때문에 변환과정 필요
    where: {
      item_code: +item_code,
    },
    // 반환 컬럼 지정
    select: {
      item_name: true,
      item_stat: true,
      item_price: true,
    },
  });

  return res.status(200).json({ data: itemDetail });
});

export default router;
