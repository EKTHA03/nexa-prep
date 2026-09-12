export function validatePdfFile(file: File): { isValid: boolean; error?: string } {
  if (!file) {
    return { isValid: false, error: 'No file selected.' };
  }

  const isPdfType = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  if (!isPdfType) {
    return { isValid: false, error: 'Invalid file type. Please upload a PDF document.' };
  }

  const maxSizeMb = 10;
  if (file.size > maxSizeMb * 1024 * 1024) {
    return { isValid: false, error: `File size exceeds ${maxSizeMb}MB limit.` };
  }

  return { isValid: true };
}
