import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGlobalContext } from '../../App/context';
import Icon from '../../shared/Icon/Icon';
import { 
    Overlay, 
    Modal, 
    Header, 
    Title, 
    CloseButton,
    Content,
    Form,
    Label,
    Select,
    Option,
    Button,
    ButtonGroup,
    ErrorMessage
} from './CreateInternalPOStyles';

const CreateInternalPO = ({ isOpen, onClose }) => {
    const { invoiceState, createFromInvoice } = useGlobalContext();
    const [selectedInvoice, setSelectedInvoice] = useState('');
    const [error, setError] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedInvoice) {
            setError('Please select an invoice');
            return;
        }

        try {
            setIsCreating(true);
            setError('');
            await createFromInvoice(selectedInvoice);
            onClose();
        } catch (error) {
            console.error('Error creating internal PO:', error);
            setError(error.message || 'Failed to create internal PO');
        } finally {
            setIsCreating(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <Overlay
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <Modal
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={e => e.stopPropagation()}
                >
                    <Header>
                        <Title>Create Internal PO</Title>
                        <CloseButton onClick={onClose}>
                            <Icon name="close" size={16} />
                        </CloseButton>
                    </Header>

                    <Content>
                        <Form onSubmit={handleSubmit}>
                            <Label htmlFor="invoice">Select Invoice</Label>
                            <Select
                                id="invoice"
                                value={selectedInvoice}
                                onChange={(e) => setSelectedInvoice(e.target.value)}
                                disabled={isCreating}
                            >
                                <Option value="">Select an invoice</Option>
                                {invoiceState.invoices.map(invoice => (
                                    <Option key={invoice.id} value={invoice.id}>
                                        {invoice.customId || invoice.id} - {invoice.clientName} - ${invoice.grandTotal}
                                    </Option>
                                ))}
                            </Select>
                            {error && <ErrorMessage>{error}</ErrorMessage>}

                            <ButtonGroup>
                                <Button type="button" onClick={onClose} disabled={isCreating}>
                                    Cancel
                                </Button>
                                <Button type="submit" $primary disabled={isCreating}>
                                    {isCreating ? 'Creating...' : 'Create Internal PO'}
                                </Button>
                            </ButtonGroup>
                        </Form>
                    </Content>
                </Modal>
            </Overlay>
        </AnimatePresence>
    );
};

export default CreateInternalPO; 