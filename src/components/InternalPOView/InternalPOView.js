import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useGlobalContext } from '../App/context';
import { useTheme } from 'styled-components';
import styled from 'styled-components';
import { useReducedMotion } from 'framer-motion';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import Icon from '../shared/Icon/Icon';
import {
    StyledInternalPOView,
    Header,
    BackButton,
    Status,
    StatusDot,
    StatusText,
    Buttons,
    Button,
    DeleteButton,
    Details,
    ItemsHeader,
    HeaderCell,
    Items,
    Item,
    ItemName,
    ItemDescription,
    ItemQty,
    ItemPrice,
    ItemVat,
    ItemTotal,
    Total,
    TotalText,
    TotalAmount,
    FormGroup,
    FormLabel,
    FormInput,
    FormSelect,
    FormTextArea,
    PlusIcon
} from './InternalPOViewStyles';
import { generateEmailTemplate, generateInternalPOEmailTemplate } from '../../services/emailService';
import EmailPreviewModal from '../shared/EmailPreviewModal/EmailPreviewModal';
import { format } from 'date-fns';
import { message } from 'antd';
import { FaArrowLeft, FaEdit, FaTrash, FaCheck } from 'react-icons/fa';

// Add ModalOverlay styled component
const ModalOverlay = styled.div`
    position: fixed;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 24px;
    background-color: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(5px);
    z-index: 100;
`;

const ModalContent = styled.div`
    width: 100%;
    max-width: 480px;
    padding: 32px;
    border-radius: 8px;
    background-color: ${({ theme }) => theme?.backgrounds?.card || '#1E2139'};
    border: 1px solid ${({ theme }) => theme?.borders || '#252945'};
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
`;

const ModalHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
`;

const ModalIconWrapper = styled.div`
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 72, 6, 0.1);
    border-radius: 50%;
`;

const ModalTitle = styled.h2`
    font-size: 24px;
    font-weight: 700;
    color: ${({ theme }) => theme?.colors?.textPrimary || '#FFFFFF'};
    margin: 0;
`;

const ModalText = styled.p`
    font-size: 15px;
    line-height: 1.84;
    color: ${({ theme }) => theme?.colors?.textSecondary || '#DFE3FA'};
    margin-bottom: 24px;
`;

const InternalPOView = () => {
    const { 
        internalPOState, 
        windowWidth, 
        handleMarkAsPaid, 
        handleDelete,
        editInternalPO,
        toggleModal 
    } = useGlobalContext();
    const { colors } = useTheme();
    const { id } = useParams();
    const history = useHistory();
    const [internalPO, setInternalPO] = useState(null);
    const [clientData, setClientData] = useState(null);
    const [companyProfile, setCompanyProfile] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDirectlyFetching, setIsDirectlyFetching] = useState(false);
    const [isClientFetching, setIsClientFetching] = useState(false);
    const [clientHasVAT, setClientHasVAT] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showVoidModal, setShowVoidModal] = useState(false);
    const [voidReason, setVoidReason] = useState('');
    const [isVoiding, setIsVoiding] = useState(false);
    const isLoading = internalPOState?.isLoading || isDirectlyFetching || isClientFetching;
    const internalPONotFound = !isLoading && !internalPO;
    const isPending = internalPO?.status === 'pending';
    const isPartiallyPaid = internalPO?.status === 'partially_paid';
    const isPaid = internalPO?.status === 'paid';
    const isVoid = internalPO?.status === 'void';
    const isDesktop = windowWidth >= 768;
    const shouldReduceMotion = useReducedMotion();
    const [quotationData, setQuotationData] = useState(null);
    const [isFetchingQuotation, setIsFetchingQuotation] = useState(false);
    const [isEditingTerms, setIsEditingTerms] = useState(false);
    const [editedTerms, setEditedTerms] = useState('');
    const [isEditingLPO, setIsEditingLPO] = useState(false);
    const [editedLPO, setEditedLPO] = useState('');
    const [isEditingDueDate, setIsEditingDueDate] = useState(false);
    const [editedDueDate, setEditedDueDate] = useState('');
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    // ... rest of the component implementation similar to InvoiceView but with internalPO instead of invoice references
    // and appropriate naming changes

    return (
        <StyledInternalPOView>
            {/* Similar JSX structure to InvoiceView but with internalPO references */}
        </StyledInternalPOView>
    );
};

export default InternalPOView; 