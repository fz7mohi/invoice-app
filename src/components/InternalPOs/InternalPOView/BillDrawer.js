import React, { useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { AnimatePresence } from 'framer-motion';
import { ref, uploadBytes, getDownloadURL, listAll, deleteObject, getMetadata } from 'firebase/storage';
import { storage } from '../../../firebase/firebase';
import Icon from '../../shared/Icon/Icon';
import styled from 'styled-components';
import {
  BillDrawerOverlay,
  BillDrawerPanel,
  BillDrawerHeader,
  BillDrawerTitle,
  BillDrawerClose,
  BillUploadArea,
  BillList,
  BillItem,
  BillPreviewThumb,
  BillInfo,
  BillName,
  BillDate,
  BillActions,
  BillActionBtn
} from './InternalPOViewStyles';
import LoadingSpinner from '../../shared/LoadingSpinner/LoadingSpinner';
import ConfirmModal from '../../shared/ConfirmModal/ConfirmModal';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
const MAX_SIZE_MB = 10;

function formatDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString();
}

// Styled modal overlay and container for preview
const PreviewModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 3000;
  background: rgba(18, 20, 32, 0.82);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.2s;
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const PreviewModalContainer = styled.div`
  background: ${({ theme }) => theme?.colors?.backgroundAlt || '#23243a'};
  border-radius: 18px;
  box-shadow: 0 8px 40px rgba(0,0,0,0.32);
  width: min(96vw, 600px);
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 0;
  animation: modalPopIn 0.22s cubic-bezier(.4,1.6,.6,1);
  outline: none;
  @keyframes modalPopIn {
    from { opacity: 0; transform: scale(0.96) translateY(40px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
`;

const PreviewModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 28px 12px 24px;
  border-bottom: 1px solid ${({ theme }) => theme?.colors?.border || '#23243a'};
  background: transparent;
`;

const PreviewModalTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme?.colors?.textPrimary || '#fff'};
  margin: 0;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const PreviewModalClose = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme?.colors?.textSecondary || '#aaa'};
  font-size: 1.7rem;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background 0.2s;
  margin-left: 12px;
  &:hover, &:focus {
    background: ${({ theme }) => theme?.colors?.backgroundItem || '#23243a'};
    color: ${({ theme }) => theme?.colors?.purple || '#7c5dfa'};
    outline: 2px solid ${({ theme }) => theme?.colors?.purple || '#7c5dfa'};
  }
`;

const PreviewModalBody = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  overflow: auto;
  background: transparent;
`;

const PreviewModalDownload = styled.a`
  margin-left: 16px;
  color: ${({ theme }) => theme?.colors?.purple || '#7c5dfa'};
  font-size: 1.1rem;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 6px;
  &:hover {
    text-decoration: underline;
  }
`;

const BillDrawer = ({ isOpen, onClose, internalPOId }) => {
  const [bills, setBills] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [previewBill, setPreviewBill] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [billToDelete, setBillToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef();

  // Fetch bills from Firebase Storage
  useEffect(() => {
    if (!isOpen || !internalPOId) return;
    let cancelled = false;
    setLoading(true);
    const fetchBills = async () => {
      try {
        const billsRef = ref(storage, `internalPOs/${internalPOId}/bills/`);
        const res = await listAll(billsRef);
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
        if (!cancelled) setBills(files);
      } catch (err) {
        if (!cancelled) setBills([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchBills();
    return () => { cancelled = true; };
  }, [isOpen, internalPOId, uploading]);

  // Handle file selection
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    await uploadBill(file);
  };

  // Handle drag and drop
  const handleDrop = async (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await uploadBill(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Upload bill to Firebase Storage
  const uploadBill = async (file) => {
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
      const billsRef = ref(storage, `internalPOs/${internalPOId}/bills/${Date.now()}_${file.name}`);
      await uploadBytes(billsRef, file, { customMetadata: { originalName: file.name } });
      setUploading(false);
    } catch (err) {
      setError('Upload failed.');
      setUploading(false);
    }
  };

  // Delete bill
  const handleDelete = async (bill) => {
    setBillToDelete(bill);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!billToDelete) return;
    setDeleting(true);
    try {
      const billRef = ref(storage, `internalPOs/${internalPOId}/bills/${billToDelete.name}`);
      await deleteObject(billRef);
      setBills((prev) => prev.filter((b) => b.name !== billToDelete.name));
      setShowDeleteDialog(false);
      setBillToDelete(null);
    } catch (err) {
      setError('Delete failed.');
      setShowDeleteDialog(false);
      setBillToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setBillToDelete(null);
    setDeleting(false);
  };

  // Open file input
  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  // Preview in modal
  const handlePreview = (bill) => {
    setPreviewBill(bill);
  };

  const handleClosePreview = () => {
    setPreviewBill(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <BillDrawerOverlay
          aria-modal="true"
          role="dialog"
        >
          <BillDrawerPanel
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={e => e.stopPropagation()}
          >
            <BillDrawerHeader>
              <BillDrawerTitle>Supplier Bills</BillDrawerTitle>
              <BillDrawerClose onClick={onClose} aria-label="Close">
                <Icon name="close" size={22} />
              </BillDrawerClose>
            </BillDrawerHeader>
            <BillUploadArea
              onClick={openFileDialog}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              tabIndex={0}
              aria-label="Upload bill"
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
            </BillUploadArea>
            {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
            <BillList>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <LoadingSpinner size={36} />
                  <div style={{ color: '#888', marginTop: 12 }}>Loading bills...</div>
                </div>
              ) : bills.length === 0 ? (
                <div style={{ color: '#888', textAlign: 'center' }}>No bills uploaded yet.</div>
              ) : (
                bills.map((bill) => (
                  <BillItem key={bill.name} onClick={() => handlePreview(bill)} style={{ cursor: 'pointer' }}>
                    <BillPreviewThumb>
                      {bill.contentType === 'application/pdf' ? (
                        <embed src={bill.url} type="application/pdf" width="48" height="48" />
                      ) : (
                        <img src={bill.url} alt={bill.originalName || bill.name} width={48} height={48} />
                      )}
                    </BillPreviewThumb>
                    <BillInfo>
                      <BillName>{bill.originalName || bill.name}</BillName>
                      <BillDate>{bill.updated ? formatDate(bill.updated) : ''}</BillDate>
                    </BillInfo>
                    <BillActions onClick={e => e.stopPropagation()}>
                      <BillActionBtn onClick={() => handlePreview(bill)} title="View">
                        <Icon name="eye" size={18} />
                      </BillActionBtn>
                      <BillActionBtn onClick={() => handleDelete(bill)} title="Delete">
                        <Icon name="trash" size={18} />
                      </BillActionBtn>
                    </BillActions>
                  </BillItem>
                ))
              )}
            </BillList>
            {/* Preview Modal */}
            {typeof window !== 'undefined' && ReactDOM.createPortal(
              <>
                <AnimatePresence>
                  {previewBill && (
                    <PreviewModalOverlay
                      aria-modal="true"
                      role="dialog"
                      tabIndex={-1}
                      onClick={handleClosePreview}
                    >
                      <PreviewModalContainer
                        tabIndex={0}
                        onClick={e => e.stopPropagation()}
                        onKeyDown={e => { if (e.key === 'Escape') handleClosePreview(); }}
                      >
                        <PreviewModalHeader>
                          <PreviewModalTitle title={previewBill.originalName || previewBill.name}>
                            {previewBill.originalName || previewBill.name}
                          </PreviewModalTitle>
                          {previewBill.contentType === 'application/pdf' && (
                            <PreviewModalDownload
                              href={previewBill.url}
                              download={previewBill.originalName || previewBill.name}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Download PDF"
                              onClick={e => e.stopPropagation()}
                            >
                              <Icon name="download" size={18} />
                              Download
                            </PreviewModalDownload>
                          )}
                          <PreviewModalClose
                            onClick={handleClosePreview}
                            aria-label="Close preview"
                            autoFocus
                          >
                            <Icon name="close" size={22} />
                          </PreviewModalClose>
                        </PreviewModalHeader>
                        <PreviewModalBody>
                          {previewBill.contentType === 'application/pdf' ? (
                            <embed
                              src={previewBill.url}
                              type="application/pdf"
                              width="100%"
                              height="100%"
                              style={{ minHeight: 400, borderRadius: 8, maxHeight: 600, width: '100%' }}
                            />
                          ) : (
                            <img
                              src={previewBill.url}
                              alt={previewBill.originalName || previewBill.name}
                              style={{ maxWidth: '100%', maxHeight: 500, borderRadius: 8 }}
                            />
                          )}
                        </PreviewModalBody>
                      </PreviewModalContainer>
                    </PreviewModalOverlay>
                  )}
                </AnimatePresence>
              </>,
              document.body
            )}
            {/* Confirm Delete Modal - always at top level */}
            {showDeleteDialog && typeof window !== 'undefined' && ReactDOM.createPortal(
              <ConfirmModal
                isOpen={showDeleteDialog}
                title="Delete Bill?"
                message={`Are you sure you want to delete \"${billToDelete?.originalName || billToDelete?.name}\"? This action cannot be undone.`}
                confirmLabel="Delete"
                cancelLabel="Cancel"
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
                iconType="warning"
                loading={deleting}
              />, document.body
            )}
          </BillDrawerPanel>
        </BillDrawerOverlay>
      )}
    </AnimatePresence>
  );
};

export default BillDrawer; 