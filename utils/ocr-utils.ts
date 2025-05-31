import { OCRResult } from '@/types';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

// Convert image URI to base64
const imageToBase64 = async (uri: string): Promise<string> => {
  if (Platform.OS === 'web') {
    // For web, fetch the image and convert to base64
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          // Remove the data:image/jpeg;base64, prefix
          const base64 = base64String.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting web image to base64:', error);
      throw error;
    }
  } else {
    // For native platforms, use FileSystem
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64;
    } catch (error) {
      console.error('Error converting native image to base64:', error);
      throw error;
    }
  }
};

// Perform OCR using AI API
export const performOCR = async (imageUri: string): Promise<OCRResult> => {
  try {
    // Convert image to base64
    const base64Image = await imageToBase64(imageUri);
    
    // Prepare the message for the AI API
    const messages = [
      {
        role: "system",
        content: "You are an OCR assistant that extracts information from receipt images. Extract the total amount, date, and merchant name. Return ONLY a JSON object with these fields: amount (number), date (YYYY-MM-DD format), merchantName (string), and text (the full extracted text)."
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Extract the total amount, date, and merchant name from this receipt image. Return the data in JSON format."
          },
          {
            type: "image",
            image: base64Image
          }
        ]
      }
    ];

    // Call the AI API
    const response = await fetch('https://toolkit.rork.com/text/llm/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    // Parse the AI response
    try {
      // The AI might return a JSON string or an object with a completion field
      let extractedData;
      if (typeof data.completion === 'string') {
        // Try to extract JSON from the text response
        const jsonMatch = data.completion.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          extractedData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Could not extract JSON from AI response');
        }
      }

      // Ensure we have the required fields
      return {
        amount: extractedData?.amount || undefined,
        date: extractedData?.date || undefined,
        merchantName: extractedData?.merchantName || undefined,
        text: extractedData?.text || data.completion || "Text extraction failed",
      };
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      // Return a fallback result with the raw text
      return {
        text: data.completion || "Text extraction failed",
      };
    }
  } catch (error) {
    console.error('OCR processing failed:', error);
    return {
      text: "OCR processing failed. Please try again.",
    };
  }
};

// Extract amount from OCR text
export const extractAmount = (text: string): number | undefined => {
  // Look for patterns like $123.45 or Total: $123.45 or Amount: 123.45
  const amountRegex = /(?:total|amount|sum|due|pay|balance)(?:\s*:)?\s*\$?\s*(\d+(?:[.,]\d{2})?)/i;
  const match = text.match(amountRegex);
  
  if (match && match[1]) {
    // Replace comma with dot for proper parsing
    const normalizedAmount = match[1].replace(',', '.');
    return parseFloat(normalizedAmount);
  }
  
  // Fallback: look for any currency amount
  const fallbackRegex = /\$\s*(\d+(?:[.,]\d{2})?)/;
  const fallbackMatch = text.match(fallbackRegex);
  
  if (fallbackMatch && fallbackMatch[1]) {
    const normalizedAmount = fallbackMatch[1].replace(',', '.');
    return parseFloat(normalizedAmount);
  }
  
  return undefined;
};

// Extract date from OCR text
export const extractDate = (text: string): string | undefined => {
  // Look for common date formats: MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD
  const dateRegexes = [
    /(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})/,  // MM/DD/YYYY or DD/MM/YYYY
    /(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})/,    // YYYY-MM-DD
    /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* (\d{1,2})(?:st|nd|rd|th)?,? (\d{4})/i  // Month DD, YYYY
  ];
  
  for (const regex of dateRegexes) {
    const match = text.match(regex);
    if (match) {
      // Different handling based on format
      if (regex === dateRegexes[0]) {
        // MM/DD/YYYY or DD/MM/YYYY - assume MM/DD/YYYY for simplicity
        const [_, part1, part2, part3] = match;
        const year = part3.length === 2 ? `20${part3}` : part3;
        return `${year}-${part1.padStart(2, '0')}-${part2.padStart(2, '0')}`;
      } else if (regex === dateRegexes[1]) {
        // YYYY-MM-DD
        const [_, year, month, day] = match;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      } else {
        // Month DD, YYYY
        const months = {
          'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04', 'may': '05', 'jun': '06',
          'jul': '07', 'aug': '08', 'sep': '09', 'oct': '10', 'nov': '11', 'dec': '12'
        };
        const monthText = match[0].substring(0, 3).toLowerCase();
        const month = months[monthText as keyof typeof months];
        const day = match[1].padStart(2, '0');
        const year = match[2];
        return `${year}-${month}-${day}`;
      }
    }
  }
  
  return undefined;
};