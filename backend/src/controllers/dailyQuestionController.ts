import { Request, Response } from 'express';
import prisma from '../services/db';

export const getDailyQuestionHandler = async (req: Request, res: Response) => {
  const { groupId } = req.params;
  try {
    const today = new Date().toISOString().slice(0, 10);
    let daily = await prisma.dailyQuestion.findFirst({
      where: {
        groupId: Number(groupId),
        date: {
          gte: new Date(`${today}T00:00:00.000Z`),
          lt: new Date(`${today}T23:59:59.999Z`)
        }
      },
      include: { question: true }
    });

    if (!daily) {
      const randomQuestion = await prisma.question.findFirst({ where: { type: 'random' } });
      if (!randomQuestion) {
        return res.status(404).json({ message: 'No hay preguntas random disponibles para asignar' });
      }

      daily = await prisma.dailyQuestion.create({
        data: {
          groupId: Number(groupId),
          questionId: randomQuestion.id,
          date: new Date()
        },
        include: { question: true }
      });
    }

    return res.json(daily);
  } catch (error) {
    res.status(500).json({ message: 'Error obtener pregunta diaria', error });
  }
};
