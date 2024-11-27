import express from "express";
import { prisma } from "../utils/prisma/index.js";
import dotenv from "dotenv";

// character.js
const express = require("express");
const router = express.Router();

router.post("/create-character", async (req, res) => {
  const { nickname } = req.body;

  // 캐릭터 이름 중복 체크
  const isExistCharacter = await prisma.characters.findFirst({
    where: { nickname },
  });

  if (isExistCharacter) {
    return res.status(409).json({ message: "이미 존재하는 닉네임입니다." });
  }

  // 캐릭터 생성 로직
  const newCharacter = await prisma.characters.create({
    data: {
      nickname,
      health: parseInt(process.env.DEFAULT_HEALTH, 10),
      power: parseInt(process.env.DEFAULT_POWER, 10),
      money: parseInt(process.env.DEFAULT_MONEY, 10),
    },
  });
  return res
    .status(201)
    .json({ message: "캐릭터 생성 성공", character: newCharacter });
});

export default router;
