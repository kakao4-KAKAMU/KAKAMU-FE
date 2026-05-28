import { create } from 'zustand';
import { persist } from 'expo-zustand-persist';
import { createSessionStorageJSONStorage } from '../utils/session-storage';

type PersonaSlice = {
  selectedPersonaId: string | null;
  selectPersona: (id: string) => void;
  clearPersonas: () => void;
};

export const usePersonaStore = create<PersonaSlice>()(
  persist(
    (set) => ({
      selectedPersonaId: '1',
      selectPersona: (id) => {
        set({ selectedPersonaId: id });
      },
      clearPersonas: () => set({ selectedPersonaId: null }),
    }),
    {
      name: 'persona',
      storage: createSessionStorageJSONStorage<PersonaSlice>(),
      partialize: (state) =>
        ({
          selectedPersonaId: state.selectedPersonaId,
        }) as PersonaSlice,
    },
  ),
);
