// Centralized logging utility for client
// Usage: import { log, setLogEnabled } from '@/api/log';

let enabled = false;
export function setLogEnabled(val: boolean) {
  enabled = val;
}
export function log(...args: any[]) {
  if (enabled) {
    // eslint-disable-next-line no-console
    console.log('[LOG]', ...args);
  }
}
