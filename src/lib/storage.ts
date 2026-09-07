import { ServiceJob, SupabaseConfig } from '../types';
import { INITIAL_SERVICE_JOBS } from '../data/mockData';

const JOBS_STORAGE_KEY = 'fixflow_ai_jobs_v2_en';
const SUPABASE_CONFIG_KEY = 'fixflow_supabase_config_v2_en';

export function loadServiceJobs(): ServiceJob[] {
  try {
    const raw = localStorage.getItem(JOBS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(INITIAL_SERVICE_JOBS));
      return INITIAL_SERVICE_JOBS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_SERVICE_JOBS;
  } catch (err) {
    console.error('Failed to read stored service jobs:', err);
    return INITIAL_SERVICE_JOBS;
  }
}

export function saveServiceJobs(jobs: ServiceJob[]): void {
  try {
    localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(jobs));
  } catch (err) {
    console.error('Failed to save service jobs to storage:', err);
  }
}

export function loadSupabaseConfig(): SupabaseConfig {
  try {
    const raw = localStorage.getItem(SUPABASE_CONFIG_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    // ignore
  }
  return {
    url: '',
    anonKey: '',
    isConnected: false,
  };
}

export function saveSupabaseConfig(config: SupabaseConfig): void {
  try {
    localStorage.setItem(SUPABASE_CONFIG_KEY, JSON.stringify(config));
  } catch (e) {
    // ignore
  }
}

// Generate unique tracking code e.g. FX-9182
export function generateTrackingCode(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `FX-${num}`;
}
