import styled from 'styled-components';

export const ModalBackdrop = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 100;
`;

export const ModalContainer = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 110;
    width: 90%;
    max-width: 480px;
`;

export const ModalContent = styled.div`
    background-color: ${({ theme }) => theme.colors.bgForm};
    border-radius: 8px;
    padding: 32px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
`;

export const Title = styled.h2`
    font-size: 20px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.textPrimary};
    margin: 0 0 16px 0;
`;

export const Message = styled.p`
    font-size: 13px;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin: 0 0 24px 0;
`;

export const ButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 8px;
`;

export const Button = styled.button`
    padding: 12px 24px;
    border-radius: 24px;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: background-color 0.2s;
`;

export const CancelButton = styled(Button)`
    background-color: ${({ theme }) => theme.colors.btnSaveAsDraft};
    color: ${({ theme }) => theme.colors.btnSaveAsDraftText};
    border: none;
    
    &:hover {
        background-color: ${({ theme }) => theme.colors.btnSaveAsDraftHover};
    }
`;

export const ConfirmButton = styled(Button)`
    background-color: ${({ theme }) => theme.colors.red};
    color: white;
    border: none;
    
    &:hover {
        background-color: ${({ theme }) => theme.colors.redLight};
    }
`; 