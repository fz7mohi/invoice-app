import React, { useState } from 'react';
import { Modal, Input, Radio, Button, message } from 'antd';
import styled from 'styled-components';

interface Theme {
    backgrounds?: {
        card?: string;
    };
    borders?: string;
}

const StyledModal = styled(Modal)<{ theme?: Theme }>`
    .ant-modal-content {
        background-color: ${({ theme }) => theme?.backgrounds?.card || '#1E2139'};
        border: 1px solid ${({ theme }) => theme?.borders || '#252945'};
    }
`;

const SplitTypeContainer = styled.div`
    margin-bottom: 20px;
`;

const AmountContainer = styled.div`
    margin-top: 20px;
`;

interface SplitInvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSplit: (splitType: 'amount' | 'percentage', value: number) => void;
    totalAmount: number;
}

const SplitInvoiceModal: React.FC<SplitInvoiceModalProps> = ({
    isOpen,
    onClose,
    onSplit,
    totalAmount
}) => {
    const [splitType, setSplitType] = useState<'amount' | 'percentage'>('percentage');
    const [value, setValue] = useState<string>('50');
    const [error, setError] = useState<string>('');

    const handleSplit = () => {
        const numValue = parseFloat(value);
        
        if (isNaN(numValue) || numValue <= 0) {
            setError('Please enter a valid amount/percentage');
            return;
        }

        if (splitType === 'percentage' && numValue > 100) {
            setError('Percentage cannot exceed 100%');
            return;
        }

        if (splitType === 'amount' && numValue > totalAmount) {
            setError('Amount cannot exceed total invoice amount');
            return;
        }

        onSplit(splitType, numValue);
        onClose();
    };

    return (
        <StyledModal
            title="Split Invoice"
            open={isOpen}
            onCancel={onClose}
            footer={null}
        >
            <SplitTypeContainer>
                <Radio.Group 
                    value={splitType} 
                    onChange={(e) => setSplitType(e.target.value)}
                >
                    <Radio value="percentage">Percentage</Radio>
                    <Radio value="amount">Amount</Radio>
                </Radio.Group>
            </SplitTypeContainer>

            <AmountContainer>
                <Input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={splitType === 'percentage' ? 'Enter percentage' : 'Enter amount'}
                    addonAfter={splitType === 'percentage' ? '%' : 'QAR'}
                />
                {error && <div style={{ color: 'red', marginTop: '5px' }}>{error}</div>}
            </AmountContainer>

            <div style={{ marginTop: '20px', textAlign: 'right' }}>
                <Button onClick={onClose} style={{ marginRight: '10px' }}>
                    Cancel
                </Button>
                <Button type="primary" onClick={handleSplit}>
                    Split Invoice
                </Button>
            </div>
        </StyledModal>
    );
};

export default SplitInvoiceModal; 