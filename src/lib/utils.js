import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';

/**
 * Combine tailwind classes
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as currency.
 */
export function formatCurrency(amount, currency = 'TZS') {
  const locale = currency === 'TZS' ? 'sw-TZ' : 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amount || 0);
}

/**
 * Formats a date string.
 */
export function formatDate(date, formatStr = 'dd MMM yyyy, HH:mm') {
  if (!date) return 'N/A';
  try {
    return format(new Date(date), formatStr);
  } catch (e) {
    return 'Invalid Date';
  }
}

/**
 * Debounce function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
