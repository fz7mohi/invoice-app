import React, { useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { AnimatePresence } from 'framer-motion';
import { ref, uploadBytes, getDownloadURL, listAll, deleteObject, getMetadata } from 'firebase/storage';
import { storage } from '../../../firebase/firebase';
import Icon from '../../shared/Icon/Icon';
import LoadingSpinner from '../../shared/LoadingSpinner/LoadingSpinner';
import ConfirmModal from '../../shared/ConfirmModal/ConfirmModal';
import {
  BillDrawerOverlay as PaymentSlipsDrawerOverlay,
  BillDrawerPanel as PaymentSlipsDrawerPanel,
  BillDrawerHeader as PaymentSlipsDrawerHeader,
  BillDrawerTitle as PaymentSlipsDrawerTitle,
  BillDrawerClose as PaymentSlipsDrawerClose,
  BillUploadArea as PaymentSlipUploadArea,
  BillList as PaymentSlipList,
  BillItem as PaymentSlipItem,
  BillPreviewThumb as PaymentSlipPreviewThumb,
  BillInfo as PaymentSlipInfo,
  BillName as PaymentSlipName,
  BillDate as PaymentSlipDate,
  BillActions as PaymentSlipActions,
  BillActionBtn as PaymentSlipActionBtn
} from './InternalPOViewStyles';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
const MAX_SIZE_MB = 10;

function formatDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString();
}

const PaymentSlipsDrawer = ({ isOpen, onClose, internalPOId }) => {
  const [slips, setSlips] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [previewSlip, setPreviewSlip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [slipToDelete, setSlipToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef();

  // Fetch payment slips from Firebase Storage
  useEffect(() => {
    if (!isOpen || !internalPOId) return;
    let cancelled = false;
    setLoading(true);
    const fetchSlips = async () => {
      try {
        const slipsRef = ref(storage, `internalPOs/${internalPOId}/paymentSlips/`);
        const res = await listAll(slipsRef);
        const files = await Promise.all(
          res.items.map(async (itemRef) => {
            const url = await getDownloadURL(itemRef);
            let originalName = itemRef.name;
            let contentType = itemRef.name.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'image';
            let updated = '';
            try {
              const metadata = await getMetadata(itemRef);
              if (metadata.customMetadata && metadata.customMetadata.originalName) {
                originalName = metadata.customMetadata.originalName;
              }
              if (metadata.contentType) contentType = metadata.contentType;
              if (metadata.updated) updated = metadata.updated;
            } catch {}
            return {
              name: itemRef.name,
              originalName,
              url,
              contentType,
              updated,
            };
          })
        );
        if (!cancelled) setSlips(files);
      } catch (err) {
        if (!cancelled) setSlips([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchSlips();
    return () => { cancelled = true; };
  }, [isOpen, internalPOId, uploading]);

  // Handle file selection
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    await uploadSlip(file);
  };

  // Handle drag and drop
  const handleDrop = async (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await uploadSlip(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Upload slip to Firebase Storage
  const uploadSlip = async (file) => {
    setError('');
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Only JPG, PNG, or PDF files are allowed.');
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File size must be less than ${MAX_SIZE_MB}MB.`);
      return;
    }
    setUploading(true);
    try {
      const slipsRef = ref(storage, `internalPOs/${internalPOId}/paymentSlips/${Date.now()}_${file.name}`);
      await uploadBytes(slipsRef, file, { customMetadata: { originalName: file.name } });
      setUploading(false);
    } catch (err) {
      setError('Upload failed.');
      setUploading(false);
    }
  };

  // Delete slip
  const handleDelete = async (slip) => {
    setSlipToDelete(slip);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!slipToDelete) return;
    setDeleting(true);
    try {
      const slipRef = ref(storage, `internalPOs/${internalPOId}/paymentSlips/${slipToDelete.name}`);
      await deleteObject(slipRef);
      setSlips((prev) => prev.filter((b) => b.name !== slipToDelete.name));
      setShowDeleteDialog(false);
      setSlipToDelete(null);
    } catch (err) {
      setError('Delete failed.');
      setShowDeleteDialog(false);
      setSlipToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setSlipToDelete(null);
    setDeleting(false);
  };

  // Open file input
  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  // Preview in modal
  const handlePreview = (slip) => {
    setPreviewSlip(slip);
  };

  const handleClosePreview = () => {
    setPreviewSlip(null);
  };

  return (
    <>
      {isOpen && (
        <PaymentSlipsDrawerOverlay
          aria-modal="true"
          role="dialog"
        >
          <PaymentSlipsDrawerPanel
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={e => e.stopPropagation()}
          >
            <PaymentSlipsDrawerHeader>
              <PaymentSlipsDrawerTitle>Payment Slips</PaymentSlipsDrawerTitle>
              <PaymentSlipsDrawerClose onClick={onClose} aria-label="Close">
                <Icon name="close" size={22} />
              </PaymentSlipsDrawerClose>
            </PaymentSlipsDrawerHeader>
            <PaymentSlipUploadArea
              onClick={openFileDialog}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              tabIndex={0}
              aria-label="Upload payment slip"
            >
              {uploading ? 'Uploading...' : 'Click or drag file here to upload (JPG, PNG, PDF)'}
              <input
                type="file"
                accept="image/jpeg,image/png,application/pdf"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleFileChange}
                tabIndex={-1}
              />
            </PaymentSlipUploadArea>
            {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
            <PaymentSlipList>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <LoadingSpinner size={36} />
                  <div style={{ color: '#888', marginTop: 12 }}>Loading payment slips...</div>
                </div>
              ) : slips.length === 0 ? (
                <div style={{ color: '#888', textAlign: 'center' }}>No payment slips uploaded yet.</div>
              ) : (
                slips.map((slip) => (
                  <PaymentSlipItem key={slip.name} onClick={() => handlePreview(slip)} style={{ cursor: 'pointer' }}>
                    <PaymentSlipPreviewThumb>
                      {slip.contentType === 'application/pdf' ? (
                        <embed src={slip.url} type="application/pdf" width={48} height={48} />
                      ) : (
                        <img src={slip.url} alt={slip.originalName || slip.name} width={48} height={48} />
                      )}
                    </PaymentSlipPreviewThumb>
                    <PaymentSlipInfo>
                      <PaymentSlipName>{slip.originalName || slip.name}</PaymentSlipName>
                      <PaymentSlipDate>{slip.updated ? formatDate(slip.updated) : ''}</PaymentSlipDate>
                    </PaymentSlipInfo>
                    <PaymentSlipActions onClick={e => e.stopPropagation()}>
                      <PaymentSlipActionBtn onClick={() => handlePreview(slip)} title="View">
                        <Icon name="eye" size={18} />
                      </PaymentSlipActionBtn>
                      <PaymentSlipActionBtn onClick={() => handleDelete(slip)} title="Delete">
                        <Icon name="trash" size={18} />
                      </PaymentSlipActionBtn>
                    </PaymentSlipActions>
                  </PaymentSlipItem>
                ))
              )}
            </PaymentSlipList>
            {/* Preview Modal */}
            {typeof window !== 'undefined' && ReactDOM.createPortal(
              <>
                <AnimatePresence>
                  {previewSlip && (
                    <PaymentSlipsDrawerOverlay
                      aria-modal="true"
                      role="dialog"
                      tabIndex={-1}
                      onClick={handleClosePreview}
                      style={{ zIndex: 3000, background: 'rgba(18,20,32,0.82)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <div
                        style={{
                          background: '#1E2139',
                          borderRadius: 16,
                          boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
                          width: 'min(96vw, 600px)',
                          height: 'min(80vh, 700px)',
                          maxWidth: 600,
                          maxHeight: 700,
                          display: 'flex',
                          flexDirection: 'column',
                          position: 'relative',
                        }}
                        onClick={e => e.stopPropagation()}
                      >
                        <PaymentSlipsDrawerHeader>
                          <PaymentSlipsDrawerTitle>{previewSlip.originalName || previewSlip.name}</PaymentSlipsDrawerTitle>
                          {previewSlip.contentType === 'application/pdf' && (
                            <a
                              href={previewSlip.url}
                              download={previewSlip.originalName || previewSlip.name}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Download PDF"
                              style={{ marginLeft: 16, color: '#7c5dfa', fontSize: '1.1rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}
                              onClick={e => e.stopPropagation()}
                            >
                              <Icon name="download" size={18} />
                              Download
                            </a>
                          )}
                          <PaymentSlipsDrawerClose
                            onClick={handleClosePreview}
                            aria-label="Close preview"
                            autoFocus
                          >
                            <Icon name="close" size={22} />
                          </PaymentSlipsDrawerClose>
                        </PaymentSlipsDrawerHeader>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 0, padding: 16 }}>
                          {previewSlip.contentType === 'application/pdf' ? (
                            <embed src={previewSlip.url} type="application/pdf" width="100%" height="100%" style={{ minHeight: 400, borderRadius: 8, maxHeight: 600 }} />
                          ) : (
                            <img src={previewSlip.url} alt={previewSlip.originalName || previewSlip.name} style={{ maxWidth: '100%', maxHeight: 500, borderRadius: 8 }} />
                          )}
                        </div>
                      </div>
                    </PaymentSlipsDrawerOverlay>
                  )}
                </AnimatePresence>
                {/* Confirm Delete Modal - always at top level */}
                {showDeleteDialog && typeof window !== 'undefined' && ReactDOM.createPortal(
                  <ConfirmModal
                    isOpen={showDeleteDialog}
                    title="Delete Payment Slip?"
                    message={`Are you sure you want to delete \"${slipToDelete?.originalName || slipToDelete?.name}\"? This action cannot be undone.`}
                    confirmLabel="Delete"
                    cancelLabel="Cancel"
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                    iconType="warning"
                    loading={deleting}
                  />, document.body
                )}
              </>,
              document.body
            )}
          </PaymentSlipsDrawerPanel>
        </PaymentSlipsDrawerOverlay>
      )}
    </>
  );
};

export default PaymentSlipsDrawer; 