import { Request, Response } from 'express';
import prisma from '../services/db';

export const submitAnswerHandler = async (req: Request, res: Response) => {
  const { questionId, userFromId, userTargetId, groupId, isAnonymous, answerText } = req.body;
  try {
    const answer = await prisma.answer.create({
      data: {
        questionId,
        userFromId,
        userTargetId: userTargetId || null,
        groupId,
        answerText: answerText || '',
        isAnonymous: !!isAnonymous,
        date: new Date()
      }
    });
    res.status(201).json(answer);
  } catch (error) {
    res.status(500).json({ message: 'Error al enviar respuesta', error });
  }
};
