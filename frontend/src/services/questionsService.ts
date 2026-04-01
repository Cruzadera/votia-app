import questions from '../../../data/questions.json';

export type Question = {
  id: string;
  texto: string;
  categoria: 'divertida' | 'positiva' | 'spicy' | 'random';
  nsfw: boolean;
  activa: boolean;
};

const allQuestions: Question[] = (questions as unknown as Question[]).filter((q) => q.activa);

const getAllQuestions = (): Question[] => [...allQuestions];

const getQuestionsByCategory = (category: string): Question[] => 
  allQuestions.filter((q) => q.categoria === category);

const getRandomQuestion = (): Question | null => {
  if (allQuestions.length === 0) return null;
  const index = Math.floor(Math.random() * allQuestions.length);
  return allQuestions[index];
};

const getDailyQuestion = (seed: number = Date.now()): Question | null => {
  if (allQuestions.length === 0) return null;
  const now = new Date();
  const daySeed = Math.floor(now.getTime() / (1000 * 60 * 60 * 24));
  const index = (daySeed + seed) % allQuestions.length;
  return allQuestions[index];
};

const getUniqueRandomQuestion = (cache: Set<string>): Question | null => {
  if (cache.size >= allQuestions.length) cache.clear();
  const available = allQuestions.filter((q) => !cache.has(q.id));
  if (!available.length) return null;
  const index = Math.floor(Math.random() * available.length);
  const question = available[index];
  cache.add(question.id);
  return question;
};

export default {
  getAllQuestions,
  getRandomQuestion,
  getQuestionsByCategory,
  getDailyQuestion,
  getUniqueRandomQuestion,
};
