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
    border-radius: 24px;
    background-color: ${({ theme }) => theme.colors.backgroundItem};
    border: 1px solid ${({ theme }) => theme.colors.purple};
    transition: all 0.3s ease;
    color: ${({ theme }) => theme.colors.white} !important;

    &:hover {
        background-color: ${({ theme }) => theme.colors.purple};
    }

    @media (min-width: 768px) {
        gap: 16px;
    }
`;

export const List = styled.ul`
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    width: clamp(280px, 25vw, 350px);
    padding: 24px;
    background-color: ${({ theme }) => theme.colors.bgFilter || '#1E2139'};
    border: 1px solid ${({ theme }) => theme.colors.purple};
    border-radius: 8px;
    z-index: 10;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
`;

export const Item = styled.li`
    &:not(:last-child) {
        margin-bottom: 16px;
    }
`;

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

// Date Filter Components
export const DateFilterSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

export const DateFilterTitle = styled.h4`
    color: ${({ theme }) => theme.colors.white};
    font-size: 14px;
    font-weight: 600;
    margin: 0;
    margin-bottom: 8px;
`;

export const DateRangeContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

export const DateInput = styled.input`
    width: 100%;
    padding: 8px 12px;
    background-color: ${({ theme }) => theme.colors.backgroundItem || '#252945'};
    border: 1px solid ${({ theme }) => theme.colors.purple}40;
    border-radius: 4px;
    color: ${({ theme }) => theme.colors.white};
    font-size: 14px;
    transition: all 0.3s ease;

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.colors.purple};
        box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.purple}20;
    }

    &::-webkit-calendar-picker-indicator {
        filter: invert(1);
        cursor: pointer;
    }
`;

export const MonthFilterContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

export const MonthSelect = styled.select`
    width: 100%;
    padding: 8px 12px;
    background-color: ${({ theme }) => theme.colors.backgroundItem || '#252945'};
    border: 1px solid ${({ theme }) => theme.colors.purple}40;
    border-radius: 4px;
    color: ${({ theme }) => theme.colors.white};
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.colors.purple};
        box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.purple}20;
    }

    option {
        background-color: ${({ theme }) => theme.colors.backgroundItem || '#252945'};
        color: ${({ theme }) => theme.colors.white};
    }
`;

export const ApplyButton = styled.button`
    ${buttonDefault}
    flex: 1;
    padding: 8px 16px;
    background-color: ${({ theme }) => theme.colors.purple};
    color: ${({ theme }) => theme.colors.white} !important;
    border: 1px solid ${({ theme }) => theme.colors.purple};
    border-radius: 4px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background-color: ${({ theme }) => theme.colors.purple}dd;
        transform: translateY(-1px);
    }

    &:active {
        transform: translateY(0);
    }
`;

export const ClearButton = styled.button`
    ${buttonDefault}
    flex: 1;
    padding: 8px 16px;
    background-color: transparent;
    color: ${({ theme }) => theme.colors.white} !important;
    border: 1px solid ${({ theme }) => theme.colors.purple}40;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background-color: ${({ theme }) => theme.colors.purple}20;
        border-color: ${({ theme }) => theme.colors.purple};
    }

    &:active {
        transform: translateY(0);
    }
`;
