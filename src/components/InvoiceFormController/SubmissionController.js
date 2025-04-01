import { useGlobalContext } from '../App/context';
import { Button } from '../shared/Button/Button';
import { Container, ButtonGroup } from './SubmissionControllerStyles';

const SubmissionController = ({ isEdited }) => {
    const {
        handleInvoiceSubmit,
        toggleInvoiceModal,
        invoiceState
    } = useGlobalContext();

    const isSubmitting = invoiceState?.isSubmitting || false;

    return (
        <Container>
            <ButtonGroup>
                <Button
                    type="button"
                    variant="secondary"
                    onClick={toggleInvoiceModal}
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    form="invoice-form"
                    variant="primary"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Saving...' : isEdited ? 'Save Changes' : 'Save & Send'}
                </Button>
            </ButtonGroup>
        </Container>
    );
};

export default SubmissionController; 