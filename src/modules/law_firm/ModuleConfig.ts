import { isModuleEnabled } from '../../core/moduleLoader';

export const isLawFirmActive = (): boolean => {
  return isModuleEnabled('law_firm');
};

export const LawFirmConfig = {
  id: 'law_firm',
  displayName: 'مكتب الذيباني للاستشارات القانونية والشرعية ⚖️',
  description: 'ميزات صياغة ومراجعة العقود والاتفاقيات، الاستشارة والتمثيل القضائي.',
};
