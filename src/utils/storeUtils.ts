import { StoreSettings } from '../types';

export function isStoreOpen(settings: StoreSettings): boolean {
  if (settings.isManuallyOpen !== null && settings.isManuallyOpen !== undefined) {
    return settings.isManuallyOpen;
  }
  
  // Real time calculation: "Todos os dias — 18h às 1h"
  const now = new Date();
  const currentHour = now.getHours(); // 0 to 23
  
  // Open between 18:00 (6 PM) and 01:00 (1 AM)
  // If openHour = 18 and closeHour = 1:
  // Open if currentHour >= 18 OR currentHour < 1
  if (settings.openHour > settings.closeHour) {
    return currentHour >= settings.openHour || currentHour < settings.closeHour;
  } else {
    return currentHour >= settings.openHour && currentHour < settings.closeHour;
  }
}

export function formatCurrency(value: number | string | undefined | null): string {
  const num = typeof value === 'number' ? value : Number(value);
  const safeNum = Number.isFinite(num) ? num : 0;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(safeNum);
}

export function cleanPhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

export function generateWhatsAppLink(
  phone: string,
  message: string
): string {
  const clean = cleanPhone(phone);
  const fullPhone = clean.startsWith('55') ? clean : `55${clean}`;
  return `https://api.whatsapp.com/send?phone=${fullPhone}&text=${encodeURIComponent(message)}`;
}

export function openWhatsApp(phone: string, message: string): void {
  const url = generateWhatsAppLink(phone, message);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.target = '_blank';
  anchor.rel = 'noopener noreferrer';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}
