import type { TPersona } from '@/types/chat';
import type { IPersonaOption } from './types';

export const USER_INPUT_WORD_LIMIT = 600;

export const PERSONAS: IPersonaOption[] = [
  {
    value: 'personal-assistant',
    label: 'Personal Assistant',
    description: 'Efficient task and productivity help',
  },
  {
    value: 'wellness-assistant',
    label: 'Wellness Assistant',
    description: 'Compassionate wellness support',
  },
  {
    value: 'relationship-advisor',
    label: 'Relationship Advisor',
    description: 'Kind, practical help with relationship challenges',
  },
  {
    value: 'companion',
    label: 'Companion',
    description: 'Friendly conversational partner',
  },
];

export const PERSONA_OPTIONS_MAP = PERSONAS.reduce(
  (acc, persona) => {
    acc[persona.value] = persona;
    return acc;
  },
  {} as Record<TPersona, IPersonaOption>,
);
