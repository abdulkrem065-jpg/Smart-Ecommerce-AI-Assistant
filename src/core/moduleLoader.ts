/**
 * Core Module Loader and Dynamic Feature Isolation Engine.
 * Ensures module features are strictly locked/hidden unless VITE_PROJECT_TYPE matches.
 */

export const getActiveProjectType = (): string => {
  return (((import.meta as any).env?.VITE_PROJECT_TYPE) || "").toLowerCase().trim();
};

export const isModuleEnabled = (moduleName: string): boolean => {
  const projectType = getActiveProjectType();
  
  // Custom isolation checks
  if (moduleName === 'games_hyper') {
    return projectType === 'games_hyper' || projectType === 'game' || projectType === 'hyper';
  }
  if (moduleName === 'pharmacy') {
    return projectType === 'pharmacy';
  }
  if (moduleName === 'law_firm') {
    return projectType === 'law_firm' || projectType === 'legal' || projectType === 'law';
  }
  
  // Fallback direct string match
  return projectType === moduleName;
};
