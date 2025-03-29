import styled from 'styled-components';

export const Backdrop = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 90;
`;

export const StyledForm = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: ${({ theme }) => theme.colors.bgForm};
    border-radius: 8px;
    width: 90%;
    max-width: 480px;
    max-height: 90vh;
    overflow-y: auto;
    z-index: 100;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
`;

export const FormHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.grayLight};
`;

export const Title = styled.h2`
    font-size: 20px;
    color: ${({ theme }) => theme.colors.textPrimary};
    font-weight: 700;
    margin: 0;
`;

export const CloseButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 24px;
    
    &:hover {
        color: ${({ theme }) => theme.colors.purple};
    }
`;

export const FormContent = styled.div`
    padding: 24px;
    flex: 1;
    overflow-y: auto;
`;

export const InputWrapper = styled.div`
    margin-bottom: 24px;
`;

export const Label = styled.label`
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    font-weight: 500;
    color: ${({ theme, $error }) => 
        $error ? theme.colors.red : theme.colors.textLabel};
    margin-bottom: 10px;
    
    span {
        color: ${({ theme }) => theme.colors.red};
    }
`;

export const Input = styled.input`
    width: 100%;
    padding: 16px;
    border-radius: 4px;
    border: 1px solid ${({ theme, $error }) => 
        $error ? theme.colors.red : theme.colors.borderColor};
    background-color: ${({ theme }) => theme.colors.inputBg};
    color: ${({ theme }) => theme.colors.textPrimary};
    font-weight: 700;
    font-size: 12px;
    outline: none;
    
    &:focus {
        border-color: ${({ theme, $error }) =>
            $error ? theme.colors.red : theme.colors.purple};
    }
    
    &::placeholder {
        color: ${({ theme }) => theme.colors.placeholder};
        opacity: 0.4;
    }
`;

export const FormFooter = styled.div`
    display: flex;
    justify-content: flex-end;
    padding: 24px;
    border-top: 1px solid ${({ theme }) => theme.colors.grayLight};
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

export const SubmitButton = styled(Button)`
    background-color: ${({ theme }) => theme.colors.purple};
    color: white;
    border: none;
    
    &:hover {
        background-color: ${({ theme }) => theme.colors.purpleLight};
    }
`; 