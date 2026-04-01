import { Request, Response } from 'express';
import prisma from '../services/db';

export const createUserHandler = async (req: Request, res: Response) => {
  const { name, avatar } = req.body;
  try {
    const user = await prisma.user.create({ data: { name, avatar: avatar || null } });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear usuario', error });
  }
};

export const getUsersHandler = async (_: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios', error });
  }
};
