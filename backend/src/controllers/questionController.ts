import { Request, Response } from 'express';
import prisma from '../services/db';
import { determineTipoSeleccion } from '../utils/questionValidator';

export const listQuestionsHandler = async (_: Request, res: Response) => {
  try {
    const questions = await prisma.question.findMany();
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar preguntas', error });
  }
};

export const createQuestionHandler = async (req: Request, res: Response) => {
  const { text, type, tipoSeleccion } = req.body;
  try {
    // Auto-determine tipoSeleccion if not provided
    const finalTipoSeleccion = tipoSeleccion || determineTipoSeleccion(text);

    const question = await prisma.question.create({
      data: {
        text,
        type: type || 'custom',
        tipoSeleccion: finalTipoSeleccion
      }
    });
    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear pregunta', error });
  }
};
