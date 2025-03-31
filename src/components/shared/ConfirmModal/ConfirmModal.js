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

const ConfirmModal = ({ title, message, onConfirm, onCancel }) => {
    return (
        <>
            <ModalBackdrop onClick={onCancel} />
            <ModalContainer>
                <ModalContent>
                    <Title>{title}</Title>
                    <Message>{message}</Message>
                    <ButtonGroup>
                        <CancelButton onClick={onCancel}>Cancel</CancelButton>
                        <ConfirmButton onClick={onConfirm}>Confirm</ConfirmButton>
                    </ButtonGroup>
                </ModalContent>
            </ModalContainer>
        </>
    );
};

export default ConfirmModal; 