import type { StorageData } from './storage';
import type { ContentEntry } from '$lib/schemas/contentTypes';

/**
 * Export all data as JSON file
 */
export function exportAsJSON(data: StorageData): void {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `hellers-content-${getDateString()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export content type as CSV
 */
export function exportAsCSV(contentType: string, entries: ContentEntry[]): void {
  if (entries.length === 0) {
    alert('Keine Einträge zum Exportieren vorhanden.');
    return;
  }

  const csvContent = convertToCSV(entries);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${contentType}-${getDateString()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Convert entries to CSV format
 */
function convertToCSV(entries: ContentEntry[]): string {
  if (entries.length === 0) return '';

  // Get all unique keys from all entries
  const allKeys = new Set<string>();
  entries.forEach(entry => {
    Object.keys(entry.data).forEach(key => {
      // Skip complex fields like arrays and objects for CSV
      if (!Array.isArray(entry.data[key]) && typeof entry.data[key] !== 'object') {
        allKeys.add(key);
      }
    });
  });

  const headers = ['id', 'createdAt', 'updatedAt', ...Array.from(allKeys)];

  // Create CSV rows
  const rows = [headers.join(',')];

  entries.forEach(entry => {
    const row = headers.map(header => {
      let value: any;

      if (header === 'id') {
        value = entry.id;
      } else if (header === 'createdAt' || header === 'updatedAt') {
        value = entry[header];
      } else {
        value = entry.data[header];
      }

      // Escape CSV values
      if (value === null || value === undefined) {
        return '';
      }

      const stringValue = String(value);

      // Wrap in quotes if contains comma, quote, or newline
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }

      return stringValue;
    });

    rows.push(row.join(','));
  });

  return rows.join('\n');
}

/**
 * Get current date string for filenames
 */
function getDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Copy JSON to clipboard
 */
export async function copyJSONToClipboard(data: StorageData): Promise<boolean> {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    await navigator.clipboard.writeText(jsonString);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}
