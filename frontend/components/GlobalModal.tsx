'use client';
import { useAppContext } from '@/contexts/AppContext';
import ImportModal from './ImportModal';
import { useRouter } from 'next/navigation';

export default function GlobalModal() {
  const { showImportModal, setShowImportModal, setImportResult } = useAppContext();
  const router = useRouter();

  if (!showImportModal) return null;

  return (
    <ImportModal
      onClose={() => setShowImportModal(false)}
      onResult={(r) => {
        setImportResult(r);
        setShowImportModal(false);
        router.push('/manage-leads');
      }}
    />
  );
}
