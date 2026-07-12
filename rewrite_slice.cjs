const fs = require('fs');

const code = `import { StateCreator } from 'zustand';
import { ref, onValue, push, set, update, remove } from 'firebase/database';
import { db } from '../../firebase';
import { FixedAsset, DepreciationEntry } from '../../core/types';

export interface FixedAssetSlice {
  fixedAssets: FixedAsset[];
  depreciationEntries: DepreciationEntry[];
  fetchFixedAssets: () => void;
  addFixedAsset: (asset: Omit<FixedAsset, 'id' | 'status' | 'depreciationRate' | 'accumulatedDepreciation' | 'bookValue' | 'monthlyDepreciation'>) => Promise<void>;
  updateFixedAsset: (id: string, updates: Partial<FixedAsset>) => Promise<void>;
  deleteFixedAsset: (id: string) => Promise<void>;
  runMonthlyDepreciation: (date: string) => Promise<void>;
  sellAsset: (id: string, sellPrice: number, cashAccountId: string, date: string) => Promise<void>;
}

export const createFixedAssetSlice: StateCreator<any, [], [], FixedAssetSlice> = (set, get) => ({
  fixedAssets: [],
  depreciationEntries: [],

  fetchFixedAssets: () => {
    const { tenantId } = get();
    if (!tenantId) return;

    const assetsRef = ref(db, \`tenants/\${tenantId}/fixed_assets\`);
    onValue(assetsRef, (snapshot) => {
      const data = snapshot.val();
      const assets = data ? Object.keys(data).map(key => ({ id: key, ...data[key] } as FixedAsset)) : [];
      set({ fixedAssets: assets });
    });

    const entriesRef = ref(db, \`tenants/\${tenantId}/depreciation_entries\`);
    onValue(entriesRef, (snapshot) => {
      const data = snapshot.val();
      const entries = data ? Object.keys(data).map(key => ({ id: key, ...data[key] } as DepreciationEntry)) : [];
      set({ depreciationEntries: entries });
    });
  },

  addFixedAsset: async (assetData) => {
    const { tenantId, isPeriodLocked } = get();
    if (!tenantId) throw new Error('No tenant');
    if (isPeriodLocked && isPeriodLocked(assetData.purchaseDate)) throw new Error('Period is locked');

    let monthlyDepreciation = 0;
    let depreciationRate = 0;

    if (assetData.depreciationMethod === 'قسط ثابت') {
      depreciationRate = 1 / assetData.usefulLife;
      monthlyDepreciation = (assetData.purchaseValue - assetData.salvageValue) / assetData.usefulLife;
    } else {
      depreciationRate = 2 / assetData.usefulLife;
      monthlyDepreciation = assetData.purchaseValue * (depreciationRate / 12);
    }

    const assetsRef = ref(db, \`tenants/\${tenantId}/fixed_assets\`);
    const newAssetRef = push(assetsRef);

    const newAsset = {
      ...assetData,
      status: 'نشط',
      depreciationRate,
      accumulatedDepreciation: 0,
      bookValue: assetData.purchaseValue,
      monthlyDepreciation
    };

    await set(newAssetRef, newAsset);
  },

  updateFixedAsset: async (id, updates) => {
    const { tenantId } = get();
    if (!tenantId) return;
    
    const assetRef = ref(db, \`tenants/\${tenantId}/fixed_assets/\${id}\`);
    await update(assetRef, updates);
  },

  deleteFixedAsset: async (id) => {
    const { tenantId, depreciationEntries } = get();
    if (!tenantId) return;

    const hasEntries = depreciationEntries.some((e: DepreciationEntry) => e.assetId === id);
    if (hasEntries) {
      throw new Error('لا يمكن حذف أصل له إهلاكات مسجلة. يرجى بيعه أو إهلاكه كلياً.');
    }

    const assetRef = ref(db, \`tenants/\${tenantId}/fixed_assets/\${id}\`);
    await remove(assetRef);
  },

  runMonthlyDepreciation: async (date) => {
    const { tenantId, fixedAssets, isPeriodLocked, recordJournalEntry } = get();
    if (!tenantId) return;
    if (isPeriodLocked && isPeriodLocked(date)) throw new Error('Period is locked');

    const activeAssets = fixedAssets.filter((a: FixedAsset) => a.status === 'نشط' && a.bookValue > a.salvageValue);
    if (activeAssets.length === 0) return;

    const updates: any = {};

    for (const asset of activeAssets) {
      let currentMonthly = asset.monthlyDepreciation;

      if (asset.depreciationMethod === 'متناقص') {
         currentMonthly = asset.bookValue * (asset.depreciationRate / 12);
      }

      if (asset.bookValue - currentMonthly < asset.salvageValue) {
        currentMonthly = asset.bookValue - asset.salvageValue;
      }

      if (currentMonthly <= 0) continue;

      const newAccumulated = asset.accumulatedDepreciation + currentMonthly;
      const newBookValue = asset.purchaseValue - newAccumulated;

      const entryRef = push(ref(db, \`tenants/\${tenantId}/depreciation_entries\`));
      const entryId = entryRef.key;

      const entry = {
        assetId: asset.id,
        assetName: asset.name,
        date,
        amount: currentMonthly,
        accumulatedBefore: asset.accumulatedDepreciation,
        accumulatedAfter: newAccumulated,
        bookValueAfter: newBookValue
      };

      updates[\`tenants/\${tenantId}/depreciation_entries/\${entryId}\`] = entry;
      updates[\`tenants/\${tenantId}/fixed_assets/\${asset.id}/accumulatedDepreciation\`] = newAccumulated;
      updates[\`tenants/\${tenantId}/fixed_assets/\${asset.id}/bookValue\`] = newBookValue;
      updates[\`tenants/\${tenantId}/fixed_assets/\${asset.id}/lastDepreciationDate\`] = date;
      
      if (newBookValue <= asset.salvageValue) {
        updates[\`tenants/\${tenantId}/fixed_assets/\${asset.id}/status\`] = 'مستهلك';
      }

      if (recordJournalEntry) {
         try {
           const jId = await recordJournalEntry({
              date,
              description: \`إهلاك شهري - \${asset.name}\`,
              entries: [
                { accountId: 'depreciation_expense', amount: currentMonthly, type: 'debit' },
                { accountId: \`accumulated_depreciation_\${asset.id}\`, amount: currentMonthly, type: 'credit' }
              ],
              sourceDocument: 'إهلاك',
              sourceDocumentId: entryId
           });
           updates[\`tenants/\${tenantId}/depreciation_entries/\${entryId}/journalEntryId\`] = jId;
         } catch(e) {
           console.warn('Journal entry failed for depreciation', e);
         }
      }
    }

    await update(ref(db), updates);
  },

  sellAsset: async (id, sellPrice, cashAccountId, date) => {
    const { tenantId, fixedAssets, isPeriodLocked, recordJournalEntry } = get();
    if (!tenantId) return;
    if (isPeriodLocked && isPeriodLocked(date)) throw new Error('Period is locked');

    const asset = fixedAssets.find((a: FixedAsset) => a.id === id);
    if (!asset) throw new Error('Asset not found');

    const assetRef = ref(db, \`tenants/\${tenantId}/fixed_assets/\${id}\`);
    await update(assetRef, {
      status: 'مباع',
      notes: \`تم البيع بقيمة \${sellPrice} بتاريخ \${date}\`
    });

    if (recordJournalEntry) {
       const profitOrLoss = sellPrice - asset.bookValue;
       const entries: any[] = [
         { accountId: cashAccountId, amount: sellPrice, type: 'debit' },
         { accountId: \`accumulated_depreciation_\${asset.id}\`, amount: asset.accumulatedDepreciation, type: 'debit' },
         { accountId: \`asset_\${asset.id}\`, amount: asset.purchaseValue, type: 'credit' }
       ];

       if (profitOrLoss > 0) {
         entries.push({ accountId: 'gain_on_sale', amount: profitOrLoss, type: 'credit' });
       } else if (profitOrLoss < 0) {
         entries.push({ accountId: 'loss_on_sale', amount: Math.abs(profitOrLoss), type: 'debit' });
       }

       await recordJournalEntry({
          date,
          description: \`بيع أصل ثابت - \${asset.name}\`,
          entries,
          sourceDocument: 'بيع أصل',
          sourceDocumentId: id
       });
    }
  }

});
`;

fs.writeFileSync('src/store/slices/fixedAssetSlice.ts', code);
