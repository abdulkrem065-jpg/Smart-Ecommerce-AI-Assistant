import { StateCreator } from 'zustand';
import { ref, set as firebaseSet, onValue } from 'firebase/database';
import { db } from '../../firebase';
import { JournalEntry } from '../../types';

export interface JournalEngineSlice {
  journalEntries: JournalEntry[];
  fetchJournalEntries: () => void;
  createAutoJournalEntry: (payload: Omit<JournalEntry, 'id' | 'is_broken'>) => void;
  updateJournalEntry: (entryId: string, updates: Partial<JournalEntry>) => void;
}

export const createJournalEngineSlice: StateCreator<JournalEngineSlice> = (set, get) => ({
  journalEntries: [],
  
  fetchJournalEntries: () => {
    const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
    const journalRef = ref(db, `niche_${activeNicheId}/accounting/journal`);
    
    onValue(journalRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        const loadedList = Object.values(val) as JournalEntry[];
        set({ journalEntries: loadedList });
      } else {
        set({ journalEntries: [] });
      }
    });
  },
  
  createAutoJournalEntry: (payload) => {
    const isLocked = (get() as any).isPeriodLocked;
    if (isLocked) {
      console.warn("Fiscal period is locked. Cannot create new journal entry.");
      return;
    }
    const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
    const totalDebit = payload.lines.reduce((sum, line) => sum + line.debit, 0);
    const totalCredit = payload.lines.reduce((sum, line) => sum + line.credit, 0);
    
    // AI Radar check at creation
    const is_broken = totalDebit !== totalCredit;
    
    const newEntry: JournalEntry = {
      ...payload,
      id: `JRN-${Date.now()}`,
      is_broken
    };
    
    firebaseSet(ref(db, `niche_${activeNicheId}/accounting/journal/${newEntry.id}`), newEntry)
      .catch((err: any) => console.error("Failed to add journal entry", err));
  },

  updateJournalEntry: (entryId, updates) => {
    const isLocked = (get() as any).isPeriodLocked;
    if (isLocked) {
      console.warn("Fiscal period is locked. Cannot update journal entry.");
      return;
    }
    const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
    const currentEntries = get().journalEntries as JournalEntry[];
    const entry = currentEntries.find(e => e.id === entryId);
    if (!entry) return;

    const updatedEntry = { ...entry, ...updates };
    
    // Re-run radar
    const totalDebit = updatedEntry.lines.reduce((sum, line) => sum + line.debit, 0);
    const totalCredit = updatedEntry.lines.reduce((sum, line) => sum + line.credit, 0);
    updatedEntry.is_broken = totalDebit !== totalCredit;

    firebaseSet(ref(db, `niche_${activeNicheId}/accounting/journal/${entryId}`), updatedEntry)
      .catch((err: any) => console.error("Failed to update journal entry", err));
  }
});
