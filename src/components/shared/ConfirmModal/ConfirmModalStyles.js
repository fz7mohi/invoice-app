import styled from 'styled-components';

export const ModalBackdrop = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(5px);
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
    background-color: #1E2139;
    border: 1px solid #252945;
    border-radius: 8px;
    padding: 32px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
`;

export const Title = styled.h2`
    font-size: 24px;
    font-weight: 700;
    color: #FFFFFF;
    margin: 0 0 16px 0;
`;

export const Message = styled.p`
    font-size: 15px;
    line-height: 1.84;
    color: #DFE3FA;
    margin: 0 0 24px 0;
`;

export const ButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 8px;
`;

export const Button = styled.button`
    min-width: 100px;
    padding: 16px 24px;
    border-radius: 24px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
`;

export const CancelButton = styled(Button)`
    background-color: #252945;
    color: #DFE3FA;
    border: none;
    
    &:hover {
        background-color: #1E2139;
    }
`;

export const ConfirmButton = styled(Button)`
    background-color: #EC5757;
    color: #FFFFFF;
    border: none;
    
    &:hover {
        background-color: #FF5252;
    }
`; 