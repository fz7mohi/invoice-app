import styled from 'styled-components';

export const Container = styled.div`
    background-color: var(--background-secondary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.2s ease;

    &:hover {
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
    }
`;

export const Content = styled.div`
    padding: 1.5rem;
`;

export const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
`;

export const Title = styled.h2`
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
`;

export const Status = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

export const StatusDot = styled.div`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${props => {
        switch (props.$status) {
            case 'pending':
                return 'var(--warning-color)';
            case 'processing':
                return 'var(--info-color)';
            case 'shipped':
                return 'var(--success-color)';
            case 'delivered':
                return 'var(--success-color)';
            case 'cancelled':
                return 'var(--error-color)';
            default:
                return 'var(--text-tertiary)';
        }
    }};
`;

export const StatusText = styled.span`
    font-size: 0.875rem;
    color: var(--text-secondary);
    text-transform: capitalize;
`;

export const Info = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-bottom: 1.5rem;
`;

export const InfoItem = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
`;

export const InfoLabel = styled.span`
    font-size: 0.875rem;
    color: var(--text-tertiary);
`;

export const InfoValue = styled.span`
    font-size: 1rem;
    color: var(--text-primary);
    font-weight: 500;
`;

export const Actions = styled.div`
    display: flex;
    gap: 0.75rem;
`;

export const ActionButton = styled.button`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    background-color: var(--background-primary);
    color: var(--text-primary);
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        border-color: var(--primary-color);
        color: var(--primary-color);
    }

    &:focus {
        outline: none;
        box-shadow: 0 0 0 2px var(--primary-color-light);
    }
`; 