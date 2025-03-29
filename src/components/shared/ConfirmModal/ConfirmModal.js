import { useGlobalContext } from '../../App/context';
import {
    ModalBackdrop,
    ModalContainer,
    ModalContent,
    Title,
    Message,
    ButtonGroup,
    CancelButton,
    ConfirmButton
} from './ConfirmModalStyles';

const ConfirmModal = ({ title, message, confirmAction, cancelAction }) => {
    const context = useGlobalContext();
    
    const handleCancel = () => {
        if (cancelAction && typeof context[cancelAction] === 'function') {
            context[cancelAction]();
        }
    };
    
    const handleConfirm = () => {
        if (confirmAction && typeof context[confirmAction] === 'function') {
            context[confirmAction]();
        }
    };
    
    return (
        <>
            <ModalBackdrop onClick={handleCancel} />
            <ModalContainer>
                <ModalContent>
                    <Title>{title}</Title>
                    <Message>{message}</Message>
                    <ButtonGroup>
                        <CancelButton onClick={handleCancel}>Cancel</CancelButton>
                        <ConfirmButton onClick={handleConfirm}>Confirm</ConfirmButton>
                    </ButtonGroup>
                </ModalContent>
            </ModalContainer>
        </>
    );
};

export default ConfirmModal; 