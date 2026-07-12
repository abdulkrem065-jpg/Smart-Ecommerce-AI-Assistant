import { StateCreator } from 'zustand';

export interface TenantConfig {
  niche: string;
  siteName: string;
  logoUrl: string;
  whatsappNumber: string;
  tickerMessage: string;
  adminPassword?: string;
  currency: string;
  exchangeRate: number;
  
  deliveryFeeEnabled: boolean;
  deliveryFeeValue: number;
  deliveryInTotal: boolean;
  deliveryVisible: boolean;
  
  taxEnabled: boolean;
  taxRate: number;
  taxInTotal: boolean;
  taxVisible: boolean;

  gameApiEnabled: boolean;
  gameApiUrl: string;
  gameApiKey: string;
  gameApiProvider: string;
  
  payApiEnabled: boolean;
  payApiProvider: string;
  payApiUrl: string;
  payApiMerchantId: string;
  payApiToken: string;
  is_period_locked?: boolean;
}

export interface TenantSlice {
  tenantConfig: TenantConfig;
  setTenantConfig: (config: Partial<TenantConfig>) => void;
  initializeFromLocalStorage: () => void;
}

const defaultTenantConfig: TenantConfig = {
  niche: 'hyper',
  siteName: 'المتجر',
  logoUrl: '',
  whatsappNumber: '967770493341',
  tickerMessage: '',
  adminPassword: '1122',
  currency: 'SAR',
  exchangeRate: 400,
  
  deliveryFeeEnabled: true,
  deliveryFeeValue: 20,
  deliveryInTotal: true,
  deliveryVisible: true,
  
  taxEnabled: true,
  taxRate: 15,
  taxInTotal: true,
  taxVisible: true,

  gameApiEnabled: false,
  gameApiUrl: '',
  gameApiKey: '',
  gameApiProvider: 'default',

  payApiEnabled: false,
  payApiProvider: 'simulated',
  payApiUrl: '',
  payApiMerchantId: '',
  payApiToken: '',
  is_period_locked: false,
};

export const createTenantSlice: StateCreator<TenantSlice> = (set) => ({
  tenantConfig: defaultTenantConfig,
  setTenantConfig: (config) => 
    set((state) => {
      const newConfig = { ...state.tenantConfig, ...config };
      // Sync to localStorage
      Object.keys(newConfig).forEach(key => {
        const value = (newConfig as any)[key];
        localStorage.setItem(`store_${key.replace(/([A-Z])/g, "_$1").toLowerCase()}`, String(value));
      });
      return { tenantConfig: newConfig };
    }),
  initializeFromLocalStorage: () => {
    set((state) => {
      const loadedConfig = { ...state.tenantConfig };
      Object.keys(loadedConfig).forEach(key => {
        const storageKey = `store_${key.replace(/([A-Z])/g, "_$1").toLowerCase()}`;
        const storedValue = localStorage.getItem(storageKey);
        if (storedValue !== null) {
          if (storedValue === 'true' || storedValue === 'false') {
            (loadedConfig as any)[key] = storedValue === 'true';
          } else if (!isNaN(Number(storedValue)) && storedValue !== '' && key !== 'whatsappNumber' && key !== 'adminPassword') {
            (loadedConfig as any)[key] = Number(storedValue);
          } else {
            (loadedConfig as any)[key] = storedValue;
          }
        }
      });
      return { tenantConfig: loadedConfig };
    });
  }
});
