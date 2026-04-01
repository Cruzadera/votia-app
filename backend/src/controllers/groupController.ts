import { Request, Response } from 'express';
import prisma from '../services/db';

export const createGroupHandler = async (req: Request, res: Response) => {
  const { name } = req.body;
  try {
    const inviteCode = Math.random().toString(36).slice(2, 8).toUpperCase();
    const group = await prisma.group.create({ data: { name, inviteCode } });
    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear grupo', error });
  }
};

export const joinGroupHandler = async (req: Request, res: Response) => {
  const { inviteCode } = req.body;
  try {
    const group = await prisma.group.findUnique({ where: { inviteCode } });
    if (!group) return res.status(404).json({ message: 'Grupo no encontrado' });
    res.json(group);
  } catch (error) {
    res.status(500).json({ message: 'Error al unirse al grupo', error });
  }
};

export const groupResultsHandler = async (req: Request, res: Response) => {
  const { groupId } = req.params;
  // TODO: agregar lógica real de ranking y estadísticas
  const group = await prisma.group.findUnique({
    where: { id: Number(groupId) },
    include: { daily: true }
  });
  res.json({ groupId, ranking: [], group });
};
