import { OCRResult } from '@/types';

// This is a mock OCR function that would be replaced with a real OCR implementation
// like Google Vision API or Tesseract.js in a production app
export const performOCR = async (imageUri: string): Promise<OCRResult> => {
  // Simulate OCR processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // In a real app, this would call an OCR API
  // For demo purposes, we'll return mock data
  
  // Simulate different results based on the image URI to make it seem more realistic
  const hash = imageUri.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  
  // Generate a somewhat random amount between $10 and $200
  const amount = 10 + (hash % 190);
  
  // Generate a date within the last 30 days
  const today = new Date();
  const daysAgo = hash % 30;
  const date = new Date(today);
  date.setDate(today.getDate() - daysAgo);
  
  // List of possible merchant names
  const merchants = [
    "Grocery Store",
    "Restaurant",
    "Gas Station",
    "Department Store",
    "Coffee Shop",
    "Pharmacy",
    "Electronics Store",
  ];
  
  // Pick a merchant based on the hash
  const merchantName = merchants[hash % merchants.length];
  
  return {
    amount: parseFloat(amount.toFixed(2)),
    date: date.toISOString().split('T')[0],
    merchantName,
    text: `Receipt\n${merchantName}\nDate: ${date.toLocaleDateString()}\nTotal: $${amount.toFixed(2)}`,
  };
};

// Extract amount from OCR text
export const extractAmount = (text: string): number | undefined => {
  // This is a simplified regex to find currency amounts
  // In a real app, this would be more sophisticated
  const amountRegex = /\$?\s?(\d+(\.\d{2})?)/;
  const match = text.match(amountRegex);
  
  if (match && match[1]) {
    return parseFloat(match[1]);
  }
  
  return undefined;
};

// Extract date from OCR text
export const extractDate = (text: string): string | undefined => {
  // This is a simplified regex to find dates in various formats
  // In a real app, this would be more sophisticated
  const dateRegex = /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/;
  const match = text.match(dateRegex);
  
  if (match) {
    const [_, month, day, year] = match;
    // Normalize year to 4 digits
    const fullYear = year.length === 2 ? `20${year}` : year;
    return `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  
  return undefined;
};