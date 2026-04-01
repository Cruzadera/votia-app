import cron from 'node-cron';
import prisma from './db';

export const startDailyQuestionCron = () => {
  // Ejecuta diariamente a las 00:01 para actualizar la pregunta del día en cada grupo
  cron.schedule('1 0 * * *', async () => {
    console.log('Cron: actualizando preguntas diarias');
    const groups = await prisma.group.findMany();
    const questions = await prisma.question.findMany({ where: { type: 'random' } });

    if (!questions.length) {
      console.warn('No hay preguntas random para asignar');
      return;
    }

    const today = new Date();

    for (const group of groups) {
      const random = questions[Math.floor(Math.random() * questions.length)];
      await prisma.dailyQuestion.upsert({
        where: {
          groupId_date: {
            groupId: group.id,
            date: today
          }
        },
        update: {
          questionId: random.id,
          date: today
        },
        create: {
          groupId: group.id,
          questionId: random.id,
          date: today
        }
      });
    }
  });
};
