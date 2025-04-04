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
    width: clamp(134px, 19vw, 192px);
    padding: 24px;
    background-color: ${({ theme }) => theme.colors.bgFilter};
    border: 1px solid ${({ theme }) => theme.colors.purple};
    border-radius: 8px;
    z-index: 10;
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
