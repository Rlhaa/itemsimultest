import express from "express";
import { prisma } from "../utils/prisma/index.js";
import authM from "../middlewares/auth.js";

const router = express.Router();

router.delete("/delete/:character_id", authM, async (req, res) => {
  // 삭제할 캐릭터의 ID 값을 가져옵니다.
  const character_id = parseInt(req.params.character_id, 10);
  console.log(character_id);
  // 삭제하려는 '캐릭터'을 가져옵니다. 없다면 에러를 발생시킵니다.
  const character = await prisma.characters.findUnique({
    where: { character_id: character_id },
  });

  if (!character) {
    return res
      .status(404)
      .json({ errorMessage: "존재하지 않는 character 데이터입니다." });
  }

  // 조회된 캐릭터를 삭제합니다.
  await prisma.characters.delete({ where: { character_id } });

  return res.status(200).json({ message: "캐릭터가 삭제되었습니다." });
});

export default router;
