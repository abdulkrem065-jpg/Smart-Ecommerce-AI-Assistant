const fs = require('fs');
let code = fs.readFileSync('src/store/slices/journalEngineSlice.ts', 'utf8');

const createEntry = `  createAutoJournalEntry: (payload) => {`;
const newCreateEntry = `  createAutoJournalEntry: (payload) => {
    const isLocked = (get() as any).isPeriodLocked;
    if (isLocked) {
      console.warn("Fiscal period is locked. Cannot create new journal entry.");
      return;
    }`;
code = code.replace(createEntry, newCreateEntry);

const updateEntry = `  updateJournalEntry: (entryId, updates) => {`;
const newUpdateEntry = `  updateJournalEntry: (entryId, updates) => {
    const isLocked = (get() as any).isPeriodLocked;
    if (isLocked) {
      console.warn("Fiscal period is locked. Cannot update journal entry.");
      return;
    }`;
code = code.replace(updateEntry, newUpdateEntry);

fs.writeFileSync('src/store/slices/journalEngineSlice.ts', code);
