import CryptoJS from 'crypto-js';

export class EncryptionService {
  static encrypt(text: string, password: string): string {
    return CryptoJS.AES.encrypt(text, password).toString();
  }

  static decrypt(encryptedText: string, password: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedText, password);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      throw new Error('Invalid password');
    }
  }

  static generatePreview(text: string, maxLength: number = 100): string {
    const plainText = text.replace(/<[^>]*>/g, '');
    return plainText.length > maxLength 
      ? plainText.substring(0, maxLength) + '...'
      : plainText;
  }
}