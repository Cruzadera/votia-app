import { Request, Response } from 'express';
import crypto from 'crypto';
import prisma from '../services/db';
import { createAutologinToken, deriveAuthKey, verifyAutologinToken } from '../utils/token';

const createInviteCode = () => Math.random().toString(36).slice(2, 8).toUpperCase();

const createUniqueInviteCode = async () => {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const inviteCode = createInviteCode();
    const existingGroup = await prisma.group.findUnique({
      where: { inviteCode },
      select: { id: true }
    });

    if (!existingGroup) {
      return inviteCode;
    }
  }

  throw new Error('No se pudo generar un código único de invitación para el grupo');
};

/**
 * Si viene con waGroupId, asocia el grupo de WhatsApp con un grupo en la BD
 * (lo crea la primera vez). Si no, garantiza que el usuario tenga al menos un grupo.
 */
const ensureGroupMembership = async (
  userId: string,
  userName: string | null,
  waGroupId: string | null,
  waGroupName: string | null
) => {
  if (waGroupId) {
    const existing = await prisma.group.findUnique({
      where: { whatsappGroupId: waGroupId },
      select: { id: true }
    });

    const groupId = existing
      ? existing.id
      : (
          await prisma.group.create({
            data: {
              name: waGroupName?.trim() || 'Grupo de WhatsApp',
              inviteCode: await createUniqueInviteCode(),
              whatsappGroupId: waGroupId
            },
            select: { id: true }
          })
        ).id;

    await prisma.groupMember.upsert({
      where: { groupId_userId: { groupId, userId } },
      update: {},
      create: { groupId, userId }
    });

    return { id: groupId };
  }

  // Fallback: si no hay info de grupo de WA, aseguramos que el usuario
  // tenga al menos un grupo propio.
  const existingMembership = await prisma.groupMember.findFirst({
    where: { userId },
    select: { group: { select: { id: true } } }
  });

  if (existingMembership?.group) {
    return existingMembership.group;
  }

  const inviteCode = await createUniqueInviteCode();
  const fallbackName = userName?.trim() ? `Grupo de ${userName.trim()}` : 'Grupo nuevo';

  return prisma.group.create({
    data: {
      name: fallbackName,
      inviteCode,
      memberships: { create: { userId } }
    },
    select: { id: true }
  });
};

export const whatsappAutologinHandler = async (req: Request, res: Response) => {
  const token = typeof req.query.token === 'string' ? req.query.token : '';
  const pollId = typeof req.query.pollId === 'string' ? req.query.pollId : '';
  const waGroupId = typeof req.query.waGroupId === 'string' ? req.query.waGroupId.trim() : '';
  const waGroupName = typeof req.query.waGroupName === 'string' ? req.query.waGroupName.trim() : '';

  if (!token) {
    return res.status(400).json({ message: 'token es obligatorio' });
  }

  try {
    const payload = verifyAutologinToken(token);
    const authKey = deriveAuthKey(payload.sub);

    const user = await prisma.user.upsert({
      where: { authKey },
      update: {},
      create: { authKey }
    });

    await ensureGroupMembership(user.id, user.name, waGroupId || null, waGroupName || null);

    const memberships = await prisma.groupMember.findMany({
      where: { userId: user.id },
      include: {
        group: {
          select: { id: true, name: true, inviteCode: true, whatsappGroupId: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const groups = memberships.map(({ group }) => ({
      id: group.id,
      name: group.name,
      inviteCode: group.inviteCode,
      whatsappGroupId: group.whatsappGroupId
    }));

    const nextStep = user.name ? 'groupList' : 'onboarding';

    return res.json({
      nextStep,
      token,
      user: {
        id: user.id,
        authKey: user.authKey,
        name: user.name,
        avatarColor: user.avatarColor,
        avatarImage: user.avatarImage,
        createdAt: user.createdAt
      },
      groups,
      pollId: pollId || null
    });
  } catch (error) {
    return res.status(401).json({ message: 'No se pudo autenticar el acceso desde WhatsApp', error });
  }
};

export const standaloneLoginHandler = async (req: Request, res: Response) => {
  const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';

  if (!name) {
    return res.status(400).json({ message: 'El nombre es obligatorio en modo standalone' });
  }

  try {
    const subject = `standalone:${crypto.randomUUID()}`;
    const authKey = deriveAuthKey(subject);
    const token = createAutologinToken(subject);
    const user = await prisma.user.upsert({
      where: { authKey },
      update: { name },
      create: {
        authKey,
        name
      }
    });

    return res.json({
      nextStep: 'groupLobby',
      token,
      user: {
        id: user.id,
        authKey: user.authKey,
        name: user.name,
        avatarColor: user.avatarColor,
        avatarImage: user.avatarImage,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'No se pudo iniciar el acceso standalone', error });
  }
};
