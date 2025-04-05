import styled, { css } from 'styled-components';

export const StyledSubmitController = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-left: auto;
    
    @media (max-width: 767px) {
        gap: 6px;
    }
    
    button {
        min-width: auto;
        padding: 8px 16px;
        font-size: 13px;
        font-weight: 500;
        
        @media (max-width: 767px) {
            padding: 6px 12px;
            font-size: 12px;
        }
    }
`;
