const STORAGE_KEY = 'henixTypeResults';

export const getResults = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Henix Type: Failed to parse localStorage data. Returning empty array.", error);
    return [];
  }
};

export const saveResult = (result) => {
  try {
    const results = getResults();
    
    const newResult = {
      ...result,
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    
    results.push(newResult);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
    
    return newResult;
  } catch (error) {
    console.error("Henix Type: Failed to save result to localStorage.", error);
    return null;
  }
};

export const clearResults = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error("Henix Type: Failed to clear localStorage.", error);
    return false;
  }
};