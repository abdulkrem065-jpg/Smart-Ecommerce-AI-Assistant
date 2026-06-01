/**
 * Core Module Loader and Dynamic Feature Isolation Engine.
 * Ensures module features are strictly locked/hidden unless VITE_PROJECT_TYPE matches.
 */

export const getActiveProjectType = (): string => {
  return (((import.meta as any).env?.VITE_PROJECT_TYPE) || "").toLowerCase().trim();
};

export const isModuleEnabled = (moduleName: string): boolean => {
  try {
    const saved = localStorage.getItem("developer_modules_matrix");
    if (saved) {
      const matrix = JSON.parse(saved);
      const found = matrix.find((m: any) => m.id === moduleName);
      if (found) {
        return found.enabled;
      }
    }
  } catch (e) {
    console.error("Error reading developer_modules_matrix:", e);
  }

  const projectType = getActiveProjectType();
  
  // Custom isolation checks
  if (moduleName === 'games_hyper') {
    return projectType === 'games_hyper' || projectType === 'game' || projectType === 'hyper';
  }
  if (moduleName === 'pharmacy') {
    return projectType === 'pharmacy' || projectType === 'hyper';
  }
  if (moduleName === 'law_firm') {
    return projectType === 'law_firm' || projectType === 'legal' || projectType === 'law' || projectType === 'hyper';
  }
  
  // Fallback direct string match
  return projectType === moduleName;
};

export const isFeatureEnabled = (moduleName: string, featureId: string): boolean => {
  if (!isModuleEnabled(moduleName)) return false;
  try {
    const saved = localStorage.getItem("developer_modules_matrix");
    if (saved) {
      const matrix = JSON.parse(saved);
      const found = matrix.find((m: any) => m.id === moduleName);
      if (found && found.features) {
        const feat = found.features.find((f: any) => f.id === featureId);
        if (feat) {
          return feat.enabled;
        }
      }
    }
  } catch (e) {
    console.error("Error reading feature status in moduleLoader:", e);
  }
  return true; // Default feature status to enabled
};
