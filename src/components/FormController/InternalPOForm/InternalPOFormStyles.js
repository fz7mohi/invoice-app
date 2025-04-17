import styled from 'styled-components';

export const Title = styled.h1`
    font-size: 24px;
    font-weight: 700;
    color: ${({ theme }) => theme?.colors?.text || '#DFE3FA'};
    margin-bottom: 24px;
`;

export const Hashtag = styled.span`
    color: ${({ theme }) => theme?.colors?.textSecondary || '#888EB0'};
`;

export const StyledForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 48px;
`;

export const Fieldset = styled.fieldset`
    border: none;
    display: flex;
    flex-direction: column;
    gap: 24px;
`;

export const Legend = styled.legend`
    font-size: 18px;
    font-weight: 700;
    color: ${({ theme }) => theme?.colors?.purple || '#7C5DFA'};
    margin-bottom: 24px;
`;

export const InputWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex: ${({ $fullWidth, $fullWidthMobile }) => {
        if ($fullWidth) return '1 1 100%';
        if ($fullWidthMobile) return '1 1 100%';
        return '1 1 0';
    }};

    @media (min-width: 768px) {
        flex: ${({ $fullWidth, $fullWidthMobile }) => {
            if ($fullWidth) return '1 1 100%';
            if ($fullWidthMobile) return '1 1 0';
            return '1 1 0';
        }};
    }
`;

export const Label = styled.label`
    font-size: 13px;
    font-weight: 500;
    color: ${({ theme, $error }) =>
        $error
            ? theme?.colors?.error || '#EC5757'
            : theme?.colors?.textSecondary || '#DFE3FA'};
`;

export const ErrorsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

export const Error = styled.span`
    color: ${({ theme }) => theme?.colors?.error || '#EC5757'};
    font-size: 13px;
    font-weight: 500;
`;

export const Input = styled.input`
    width: 100%;
    padding: 12px;
    border: 1px solid
        ${({ theme, $error }) =>
            $error
                ? theme?.colors?.error || '#EC5757'
                : theme?.borders || '#252945'};
    border-radius: 4px;
    background-color: ${({ theme }) => theme?.backgrounds?.input || '#1E2139'};
    color: ${({ theme }) => theme?.colors?.text || '#DFE3FA'};
    font-size: 14px;

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme?.colors?.purple || '#7C5DFA'};
    }
`;

export const InputsGroup = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
    flex-direction: ${({ $fullWidthMobile }) =>
        $fullWidthMobile ? 'column' : 'row'};

    @media (min-width: 768px) {
        flex-direction: row;
    }
`; 