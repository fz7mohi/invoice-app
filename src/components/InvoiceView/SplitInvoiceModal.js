import React, { useState } from 'react';
import { Modal, Input, Radio, Button } from 'antd';
import styled from 'styled-components';
import Icon from '../shared/Icon/Icon';

const StyledModal = styled(Modal)`
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
    background-color: rgba(124, 93, 250, 0.1);
    border-radius: 50%;
`;

const ModalTitle = styled.h2`
    font-size: 24px;
    font-weight: 700;
    color: ${({ theme }) => theme?.colors?.textPrimary || '#FFFFFF'};
    margin: 0;
`;

const SplitInvoiceModal = ({ isOpen, onClose, onSplit, totalAmount }) => {
    const [splitType, setSplitType] = useState('percentage');
    const [value, setValue] = useState('50');
    const [error, setError] = useState('');

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
            title={
                <ModalHeader>
                    <ModalIconWrapper>
                        <Icon name="scissors" size={20} color="#7C5DFA" />
                    </ModalIconWrapper>
                    <ModalTitle>Split Invoice</ModalTitle>
                </ModalHeader>
            }
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