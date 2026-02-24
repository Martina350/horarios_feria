import { api } from './api';

/**
 * Servicio para generar reportes (admin)
 */
export const reportsService = {
  /**
   * Exporta un reporte en formato Excel o CSV
   */
  async exportReport(
    format: 'xlsx' | 'csv',
    filters?: {
      dayId?: string;
      slotId?: string;
      status?: string;
      amie?: string;
    }
  ): Promise<Blob> {
    const params = new URLSearchParams();
    params.append('format', format);
    if (filters?.dayId) params.append('dayId', filters.dayId);
    if (filters?.slotId) params.append('slotId', filters.slotId);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.amie) params.append('amie', filters.amie);

    const response = await api.get(`/reports/export?${params.toString()}`, {
      responseType: 'blob',
    });

    return response.data;
  },

  /**
   * Descarga un archivo desde un Blob
   */
  downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};
