'use client';
import React, { createContext, useContext, useState } from 'react';

export interface CrmRecord {
  created_at?: string;
  name?: string;
  email?: string;
  country_code?: string;
  mobile_without_country_code?: string;
  company?: string;
  city?: string;
  state?: string;
  country?: string;
  lead_owner?: string;
  crm_status?: string;
  crm_note?: string;
  data_source?: string;
  possession_time?: string;
  description?: string;
  skip_reason?: string;
}

export interface ImportResult {
  total: number;
  imported_count: number;
  skipped_count: number;
  imported: CrmRecord[];
  skipped: CrmRecord[];
}

interface AppContextType {
  importResult: ImportResult | null;
  setImportResult: (r: ImportResult | null) => void;
  showImportModal: boolean;
  setShowImportModal: (v: boolean) => void;
}

const AppContext = createContext<AppContextType>({
  importResult: null,
  setImportResult: () => {},
  showImportModal: false,
  setShowImportModal: () => {},
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  return (
    <AppContext.Provider value={{ importResult, setImportResult, showImportModal, setShowImportModal }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
