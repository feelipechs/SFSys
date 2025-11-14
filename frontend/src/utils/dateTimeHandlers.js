// 1. Converte string ISO para objeto Date (para o useState/Calendar)
export const createDateObject = (isoString) => {
  if (!isoString) return undefined;
  return new Date(isoString);
};

// 2. Extrai HH:MM:SS de string ISO (para o Input Time)
export const extractTime = (isoString) => {
  if (!isoString) return '10:30:00';
  try {
    const date = new Date(isoString);
    // ... (Seu código de extração usando getUTCHours(), etc.)
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  } catch (error) {
    return '10:30:00';
  }
};

// 3. Combina Date e Time em string ISO/UTC (para o onChange do react-hook-form)
export const combineDateTimeToISO = (dateObject, timeString) => {
  if (!dateObject) return null;

  const [hours, minutes, seconds] = timeString.split(':').map(Number);

  const newDateObject = new Date(dateObject);
  // Força a hora a ser tratada como UTC
  newDateObject.setUTCHours(hours, minutes, seconds || 0, 0);

  return newDateObject.toISOString();
};
