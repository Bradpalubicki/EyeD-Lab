import { create } from 'zustand';

interface MedicalRecord {
  id: string;
  type: 'allergy' | 'medication' | 'condition' | 'lab' | 'imaging' | 'procedure' | 'immunization';
  title: string;
  data: Record<string, unknown>;
  createdAt: string;
}

interface RecordsState {
  records: MedicalRecord[];
  addRecord: (record: Omit<MedicalRecord, 'id' | 'createdAt'>) => void;
  deleteRecord: (id: string) => void;
}

export const useRecordsStore = create<RecordsState>((set) => ({
  records: [],
  addRecord: (record) => {
    const newRecord: MedicalRecord = {
      ...record,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ records: [...state.records, newRecord] }));
  },
  deleteRecord: (id) => {
    set((state) => ({ records: state.records.filter((r) => r.id !== id) }));
  },
}));
