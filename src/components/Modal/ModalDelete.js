import Button from '../shared/Button/Button';
import { useGlobalContext } from '../App/context';
import { useHistory } from 'react-router-dom';
import { Container, Title, Text, CtaGroup } from './ModalStyles';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

const ModalDelete = ({ variants }) => {
    const { invoiceState, toggleModal, handleDelete } = useGlobalContext();
    const history = useHistory();
    const [invoiceData, setInvoiceData] = useState(null);

    // Fetch invoice data to get the customId
    useEffect(() => {
        const fetchInvoiceData = async () => {
            if (invoiceState?.currInvoiceIndex) {
                try {
                    const invoiceRef = doc(db, 'invoices', invoiceState.currInvoiceIndex);
                    const invoiceSnap = await getDoc(invoiceRef);
                    if (invoiceSnap.exists()) {
                        setInvoiceData(invoiceSnap.data());
                    }
                } catch (error) {
                    console.error('Error fetching invoice data:', error);
                }
            }
        };

        fetchInvoiceData();
    }, [invoiceState?.currInvoiceIndex]);

    const handleDeleteAndClose = async () => {
        try {
            await handleDelete();
            // Navigate to invoices list instead of home
            history.push('/invoices');
        } catch (error) {
            console.error('Error deleting invoice:', error);
        }
    };

    return (
        <Container variants={variants}>
            <Title>Confirm Deletion</Title>
            <Text>
                Are you sure you want to delete invoice #
                {invoiceData?.customId || invoiceState?.currInvoiceIndex}? This action cannot be undone.
            </Text>
            <CtaGroup>
                <Button type="button" $secondary onClick={toggleModal}>
                    Cancel
                </Button>
                <Button
                    type="button"
                    $delete
                    onClick={handleDeleteAndClose}
                >
                    Delete
                </Button>
            </CtaGroup>
        </Container>
    );
};

export default ModalDelete;
