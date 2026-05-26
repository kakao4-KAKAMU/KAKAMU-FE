import type { Persona } from '@kakamu/types';
import { create } from 'zustand';

type PersonaSlice = {
  personas: Persona[];
  selectedPersonaId: string | null;
  addPersona: (persona: Persona) => void;
  removePersona: (id: string) => void;
  selectPersona: (id: string) => void;
  clearPersonas: () => void;
};

export const usePersonaStore = create<PersonaSlice>()((set, get) => ({
  personas: [],
  selectedPersonaId: null,
  addPersona: (persona) =>
    set((state) => ({
      personas: [...state.personas, persona],
    })),
  removePersona: (id) =>
    set((state) => ({
      personas: state.personas.filter((persona) => persona.id !== id),
      selectedPersonaId:
        state.selectedPersonaId === id ? null : state.selectedPersonaId,
    })),
  selectPersona: (id) => {
    const exists = get().personas.some((persona) => persona.id === id);
    if (!exists) {
      return;
    }
    set({ selectedPersonaId: id });
  },
  clearPersonas: () => set({ personas: [], selectedPersonaId: null }),
}));
