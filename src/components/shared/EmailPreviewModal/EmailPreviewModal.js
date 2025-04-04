import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Icon from '../Icon/Icon';
import Button from '../Button/Button';
import { sendEmailWithAttachment } from '../../../services/emailService';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundItem};
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid ${({ theme }) => theme.colors.border};
  animation: modalSlideIn 0.3s ease-out;

  @keyframes modalSlideIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const ModalIconWrapper = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.purple}20;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
`;

const ModalBody = styled.div`
  padding: 20px;
`;

const EmailPreview = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  background-color: ${({ theme }) => theme.colors.background};
  max-height: 300px;
  overflow-y: auto;
`;

const EmailSubject = styled.div`
  font-weight: 600;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const EmailContent = styled.div`
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.5;
`;

const AttachmentPreview = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: ${({ theme }) => theme.colors.backgroundItem || theme.colors.background};
  border-radius: 8px;
  margin-top: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const AttachmentIcon = styled.div`
  margin-right: 10px;
  color: ${({ theme }) => theme.colors.purple};
`;

const AttachmentName = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-radius: 16px;
`;

const LoadingSpinner = styled.div`
  border: 3px solid rgba(124, 93, 250, 0.2);
  border-top: 3px solid ${({ theme }) => theme.colors.purple};
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const EmailPreviewModal = ({
  isOpen,
  onClose,
  onSend,
  emailData,
  documentType,
  documentId,
  clientName,
  clientEmail,
  amount,
  currency,
  dueDate,
  pdfBase64,
  pdfName
}) => {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  // Add cleanup effect to prevent state updates after unmounting
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  if (!isOpen) return null;

  const handleSend = async () => {
    try {
      setIsSending(true);
      setError(null);
      
      // Log the data being sent for debugging
      console.log('Sending email with data:', {
        to: clientEmail,
        subject: emailData.subject,
        documentType,
        documentId,
        pdfName,
        pdfBase64Length: pdfBase64 ? pdfBase64.length : 0
      });
      
      await sendEmailWithAttachment(
        clientEmail,
        emailData.subject,
        emailData.content,
        pdfBase64,
        pdfName
      );
      
      // Only update state if component is still mounted
      if (isMounted.current) {
        if (onSend) {
          onSend();
        }
        
        onClose();
      }
    } catch (err) {
      console.error('Error sending email:', err);
      // Only update state if component is still mounted
      if (isMounted.current) {
        setError('Failed to send email. Please try again.');
      }
    } finally {
      // Only update state if component is still mounted
      if (isMounted.current) {
        setIsSending(false);
      }
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        {isSending && (
          <LoadingOverlay>
            <LoadingSpinner />
          </LoadingOverlay>
        )}
        
        <ModalHeader>
          <ModalIconWrapper>
            <Icon name="mail" size={20} color="#7C5DFA" />
          </ModalIconWrapper>
          <ModalTitle>Send {documentType === 'invoice' ? 'Invoice' : 'Quotation'}</ModalTitle>
        </ModalHeader>
        
        <ModalBody>
          <EmailPreview>
            <EmailSubject>{emailData.subject}</EmailSubject>
            <EmailContent dangerouslySetInnerHTML={{ __html: emailData.content }} />
            <AttachmentPreview>
              <AttachmentIcon>
                <Icon name="file" size={16} />
              </AttachmentIcon>
              <AttachmentName>{pdfName}</AttachmentName>
            </AttachmentPreview>
          </EmailPreview>
          
          {error && (
            <div style={{ color: 'red', marginBottom: '10px' }}>
              {error}
            </div>
          )}
        </ModalBody>
        
        <ModalFooter>
          <Button
            $secondary
            onClick={onClose}
            disabled={isSending}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: `1px solid ${({ theme }) => theme.colors.border}`,
              backgroundColor: 'transparent',
              color: ({ theme }) => theme.colors.text,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontSize: '0.9rem'
            }}
          >
            Cancel
          </Button>
          <Button
            $primary
            onClick={handleSend}
            disabled={isSending}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              backgroundColor: '#7C5DFA',
              color: 'white',
              border: 'none',
              cursor: isSending ? 'not-allowed' : 'pointer',
              opacity: isSending ? 0.7 : 1,
              transition: 'all 0.2s ease',
              fontSize: '0.9rem'
            }}
          >
            {isSending ? 'Sending...' : 'Send'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};

export default EmailPreviewModal; 