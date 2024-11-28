import express from "express";
import { prisma } from "../utils/prisma/index.js";

const router = express.Router();

router.get("/search", async (req, res, next) => {
  const characters = await prisma.characters.findMany({
    select: {
      nickname: true,
      health: true,
      power: true,
      created_at: true,
    },
    orderBy: {
      created_at: "desc", // 게시글을 최신순으로 정렬합니다.
    },
  });

  return res.status(200).json({ data: characters });
});

router.get("/search/:character_id", async (req, res, next) => {
  // req.params에서 character_id 추출
  const { character_id } = req.params;

  // 특정 조건에 맞는 캐릭터는 MyCharacter
  const MyCharacter = await prisma.characters.findFirst({
    // 그 조건은 characters 테이블의 character_id 컬럼에
    // 요청된 character_id가 있는지 확인
    // +character_id의 +는 문자열을 숫자로 변환하는 방법중 하나
    // character_id는 파라미터로 전달되는데, 이때 문자열로 전달된다.
    // character_id는 숫자형태이기 때문에 변환과정 필요
    where: {
      character_id: +character_id,
    },
    // 반환 컬럼 지정
    select: {
      nickname: true,
      health: true,
      power: true,
      // 상세조회 시 money 컬럼까지 조회
      money: true,
      created_at: true,
    },
  });

  return res.status(200).json({ data: MyCharacter });
});

export default router;
