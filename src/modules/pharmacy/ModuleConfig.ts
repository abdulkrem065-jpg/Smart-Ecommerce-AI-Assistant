import { isModuleEnabled } from '../../core/moduleLoader';

export const isPharmaActive = (): boolean => {
  return isModuleEnabled('pharmacy');
};

export const PharmaConfig = {
  id: 'pharmacy',
  displayName: 'صيدلية العناية والشفاء السحابية 🧪',
  description: 'ميزات مخصصة لصيدلية سحابية رقمية بما في ذلك استشارات الوصفات التراكمية الطبية.',
};
