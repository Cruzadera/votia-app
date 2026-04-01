/**
 * Validator for question type (tipoSeleccion)
 * Rules:
 * - SINGLE: Question implies comparison or highlighting one person
 *   Keywords: "el/la más", "el/la primero/a", "más probabilidades de"
 * - MULTIPLE: Question applies to multiple people
 *   Keywords: "ha", "han", "alguna vez", "suele", "quién ha", "quién suele"
 */

type TipoSeleccion = 'single' | 'multiple';

const SINGLE_PATTERNS = [
  /el\s+(?:la\s+)?más\s+\w+/i,        // el/la más [adjective]
  /la\s+más\s+\w+/i,                  // la más [adjective]
  /el\s+primero?\s+en\s+/i,           // el primero/a en
  /la\s+primera\s+en\s+/i,            // la primera en
  /más\s+probabilidades\s+de\s+/i,   // más probabilidades de
  /quién\s+sería\s+(?:el\s+|la\s+)?(?:primero|primera)/i,  // quién sería el/la primero/a
];

const MULTIPLE_PATTERNS = [
  /quién\s+(?:ha|han)\s+/i,           // quién ha/han [action]
  /quién\s+suele\s+/i,                // quién suele [action]
  /quién\s+\w+\s+alguna\s+vez\s+/i,  // quién [verb] alguna vez
  /ha\s+llegado\s+/i,                 // ha llegado (past tense example)
  /han\s+llegado\s+/i,                // han llegado
  /se\s+(?:ha|han)\s+olvidado/i,      // se ha/han olvidado
  /ha\s+hecho\s+el\s+ridículo/i,     // ha hecho el ridículo
];

export function determineTipoSeleccion(questionText: string): TipoSeleccion {
  const text = questionText.toLowerCase().trim();

  // Check for single patterns
  for (const pattern of SINGLE_PATTERNS) {
    if (pattern.test(text)) {
      return 'single';
    }
  }

  // Check for multiple patterns
  for (const pattern of MULTIPLE_PATTERNS) {
    if (pattern.test(text)) {
      return 'multiple';
    }
  }

  // If no clear pattern is found, determine contextually
  // Look for superlatives (más, menos) combined with adjectives
  if (/\b(?:más|menos)\s+\w+(?:\s+del\s+grupo|\s+importante|\s+\w+)?$/i.test(text)) {
    return 'single';
  }

  // Default to multiple if ambiguous (safer default)
  return 'multiple';
}

export function validateTipoSeleccion(questionText: string): {
  isValid: boolean;
  tipoSeleccion: TipoSeleccion;
  confidence: 'high' | 'medium' | 'low';
} {
  const tipoSeleccion = determineTipoSeleccion(questionText);

  // Check pattern matching confidence
  const text = questionText.toLowerCase();
  const isHighConfidence =
    SINGLE_PATTERNS.some(p => p.test(text)) ||
    MULTIPLE_PATTERNS.some(p => p.test(text));

  const confidence = isHighConfidence ? 'high' : 'low';

  // Questions should always be valid - we auto-determine the type
  return {
    isValid: true,
    tipoSeleccion,
    confidence,
  };
}
