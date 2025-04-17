import styled from 'styled-components';

export const FilterContainer = styled.div`
    position: relative;
    margin-right: 16px;

    @media (min-width: 768px) {
        margin-right: 24px;
    }
`;

export const FilterButton = styled.button`
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.white} !important;
    padding: 8px 16px;
    border-radius: 24px;
    background-color: ${({ theme }) => theme.colors.backgroundItem};
    border: 1px solid ${({ theme }) => theme.colors.purple};
    transition: all 0.3s ease;

    &:hover {
        background-color: ${({ theme }) => theme.colors.purple};
        color: ${({ theme }) => theme.colors.white} !important;
    }

    span {
        @media (max-width: 480px) {
            display: none;
        }
    }

    img {
        transition: transform 0.2s ease;
        transform: ${({ isFilterOpen }) =>
            isFilterOpen ? 'rotate(180deg)' : 'rotate(0)'};
    }
`;

export const Dropdown = styled.div`
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    min-width: 192px;
    border-radius: 8px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
    background-color: ${({ theme }) => theme.colors.backgroundItem};
    border: 1px solid ${({ theme }) => theme.colors.purple};
    z-index: 10;

    div {
        padding: 16px 24px;
        cursor: pointer;
        color: ${({ theme }) => theme.colors.white} !important;
        transition: all 0.3s ease;
        font-weight: 500;

        &:hover {
            background-color: ${({ theme }) => theme.colors.purple};
            color: ${({ theme }) => theme.colors.white} !important;
        }

        &:first-child {
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        }

        &:last-child {
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
        }
    }
`;

export const Checkbox = styled.div`
    display: flex;
    align-items: center;
    gap: 1.2rem;
    font-weight: 700;
    color: ${({ theme }) => theme.textPrimary};

    div {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1.6rem;
        height: 1.6rem;
        border-radius: 0.2rem;
        background-color: ${({ isChecked, theme }) =>
            isChecked ? theme.checkboxBg : theme.checkboxBgUnchecked};

        &:hover {
            border: 1px solid ${({ theme }) => theme.btnPrimary};
        }
    }
`;

export const Label = styled.label`
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.textPrimary};
    transition: color 0.3s ease;

    &:hover {
        color: ${({ theme }) => theme.colors.purple};
    }
`; 