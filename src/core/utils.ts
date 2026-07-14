export const formatDate = (dateString: string, lang: string = 'ar'): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString(lang === 'en' ? 'en-US' : 'ar-SA');
};

export const formatCurrency = (amount: number, currency: string = 'SAR', lang: string = 'ar'): string => {
  if (amount === undefined || amount === null) return '';
  return new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'ar-SA', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};
