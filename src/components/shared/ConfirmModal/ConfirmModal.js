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

const ConfirmModal = ({ title, message, onConfirm, onCancel, loading }) => {
    return (
        <>
            <ModalBackdrop onClick={onCancel} />
            <ModalContainer>
                <ModalContent>
                    <Title>{title}</Title>
                    <Message>{message}</Message>
                    <ButtonGroup>
                        <CancelButton onClick={onCancel} disabled={loading}>Cancel</CancelButton>
                        <ConfirmButton onClick={onConfirm} disabled={loading}>
                            {loading ? 'Deleting...' : 'Confirm'}
                        </ConfirmButton>
                    </ButtonGroup>
                </ModalContent>
            </ModalContainer>
        </>
    );
};

export default ConfirmModal; 