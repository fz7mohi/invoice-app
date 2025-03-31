import styled, { css } from 'styled-components';
import checkIcon from '../../../assets/images/icon-check.svg';
import { buttonDefault } from '../../shared/Button/ButtonStyles';

export const StyledFilter = styled.div`
    position: relative;
`;

export const Button = styled.button`
    ${buttonDefault}
    display: flex;
    flex-flow: row;
    gap: 12px;
    align-items: center;
    padding: 8px 16px;
    background-color: #1E2139;
    border: 1px solid ${({ theme }) => theme.colors.purple};
    border-radius: 24px;
    color: #FFFFFF !important;
    font-weight: 700;
    transition: all 0.3s ease;

    &:hover {
        background-color: ${({ theme }) => theme.colors.purple};
        color: #FFFFFF !important;
    }

    @media (min-width: 768px) {
        gap: 16px;
    }
`;

export const List = styled.ul`
    display: flex;
    position: absolute;
    flex-flow: column;
    gap: 16px;
    top: calc(100% + 8px);
    left: 50%;
    width: clamp(134px, 19vw, 192px);
    padding: 24px;
    background-color: #1E2139;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
    border-radius: 8px;
    transform: translateX(-50%);
    transition: all 0.3s ease;
    z-index: 10;
    border: 1px solid ${({ theme }) => theme.colors.purple};
`;

export const Item = styled.li``;

export const StatusFilter = styled.button`
    ${buttonDefault}
    position: relative;
    padding: 0 0 0 29px;
    width: 100%;
    text-align: left;
    color: #FFFFFF !important;
    transition: all 0.3s ease;
    background-color: #1E2139;

    &::before {
        position: absolute;
        content: '';
        top: -2px;
        left: 0;
        width: 16px;
        height: 16px;
        background-color: #1E2139;
        border: 1px solid ${({ theme }) => theme.colors.purple};
        border-radius: 2px;
        transition: all 0.3s ease;

        ${({ $isActive }) =>
            $isActive === true &&
            css`
                background-color: ${({ theme }) => theme.colors.purple};
                background-image: url('${checkIcon}');
                background-repeat: no-repeat;
                background-size: 10px;
                background-position: center;
                border-color: ${({ theme }) => theme.colors.purple};
            `}
    }

    &:hover {
        color: ${({ theme }) => theme.colors.purple} !important;
        background-color: #252945;
        
        &::before {
            border-color: ${({ theme }) => theme.colors.purple};
        }
    }
`; 