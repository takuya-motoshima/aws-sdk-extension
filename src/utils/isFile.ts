import fs from 'fs';

/**
  * Check if it is a file.
  * @param {string} filePath File Path.
  * @return {boolean} True if the file is a file.
  */
export default (filePath: string): boolean => {
  try {
    const stats = fs.statSync(filePath);
    return stats.isFile();
  } catch {
    return false;
  }
}
