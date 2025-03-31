import Button from '../shared/Button/Button';
import { useGlobalContext } from '../App/context';
import { useHistory } from 'react-router-dom';
import { Container, Title, Text, CtaGroup } from './ModalStyles';

const ModalDeleteQuotation = ({ variants }) => {
    const { quotationState, toggleQuotationModal, handleQuotationDelete } = useGlobalContext();
    const history = useHistory();

    const handleDelete = async () => {
        try {
            console.log('Delete button clicked in ModalDeleteQuotation');
            console.log('Current modal state:', quotationState.modal);
            
            if (!quotationState.modal.id) {
                console.error('No quotation ID found in modal state');
                return;
            }

            // First delete the quotation
            console.log('Calling handleQuotationDelete');
            await handleQuotationDelete();
            console.log('handleQuotationDelete completed successfully');
            
            // Then close the modal
            console.log('Closing modal');
            toggleQuotationModal();
            console.log('Modal closed');
            
            // Finally redirect to quotations list
            console.log('Redirecting to quotations list');
            history.push('/quotations');
            console.log('Redirected to quotations list');
        } catch (error) {
            console.error('Error in ModalDeleteQuotation handleDelete:', error);
        }
    };

    return (
        <Container variants={variants}>
            <Title>Confirm Deletion</Title>
            <Text>
                Are you sure you want to delete quotation #
                {quotationState.modal.id}? This action cannot be undone.
            </Text>
            <CtaGroup>
                <Button type="button" $secondary onClick={toggleQuotationModal}>
                    Cancel
                </Button>
                <Button
                    type="button"
                    $delete
                    onClick={handleDelete}
                >
                    Delete
                </Button>
            </CtaGroup>
        </Container>
    );
};

export default ModalDeleteQuotation; 