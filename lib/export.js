// Data export utilities for CSV and JSON formats

export const exportToCSV = (data, filename = 'export.csv') => {
  if (!data || data.length === 0) {
    console.warn('[v0] No data to export');
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);

  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...data.map((row) =>
      headers.map((header) => {
        const value = row[header];
        // Escape quotes and wrap in quotes if contains comma
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    ),
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToJSON = (data, filename = 'export.json') => {
  if (!data) {
    console.warn('[v0] No data to export');
    return;
  }

  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], {
    type: 'application/json;charset=utf-8;',
  });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const generatePDF = (content, filename = 'export.pdf') => {
  // Note: For full PDF generation in production, use a library like jsPDF
  console.log('[v0] PDF export requires jsPDF library');
  console.log('[v0] Content to export:', content);
};

export const downloadReport = (reportType, format = 'csv') => {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `${reportType}-${timestamp}.${format === 'csv' ? 'csv' : format === 'json' ? 'json' : 'pdf'}`;
  console.log('[v0] Downloading report:', filename);
  return filename;
};
