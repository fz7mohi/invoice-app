import styled, { keyframes } from 'styled-components';

// Spinning animation
const spin = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`;

// Pulse animation
const pulse = keyframes`
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.8; }
`;

// Bounce animation for dots
const bounce = keyframes`
    0%, 80%, 100% { 
        transform: scale(0);
        opacity: 0.5;
    } 
    40% { 
        transform: scale(1);
        opacity: 1;
    }
`;

// Wave animation
const wave = keyframes`
    0%, 40%, 100% {
        transform: scaleY(0.4);
    }
    20% {
        transform: scaleY(1);
    }
`;

export const LoadingContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    padding: 2rem;
    background: ${({ theme }) => theme.colors.bgPrimary};
    border-radius: 12px;
    margin: 1rem;
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
            45deg,
            ${({ theme }) => theme.colors.purple}10,
            ${({ theme }) => theme.colors.purple}05,
            ${({ theme }) => theme.colors.purple}10
        );
        animation: ${pulse} 2s ease-in-out infinite;
        z-index: 0;
    }
`;

export const SpinnerContainer = styled.div`
    position: relative;
    z-index: 1;
    margin-bottom: 1.5rem;
`;

export const Spinner = styled.div`
    width: ${({ size }) => size === 'small' ? '24px' : size === 'medium' ? '36px' : '48px'};
    height: ${({ size }) => size === 'small' ? '24px' : size === 'medium' ? '36px' : '48px'};
    border: ${({ size }) => size === 'small' ? '2px' : size === 'medium' ? '3px' : '4px'} solid ${({ theme }) => theme.colors.purple}20;
    border-top: ${({ size }) => size === 'small' ? '2px' : size === 'medium' ? '3px' : '4px'} solid ${({ theme }) => theme.colors.purple};
    border-radius: 50%;
    animation: ${spin} 1s linear infinite;
    margin-bottom: 1rem;
`;

export const LoadingText = styled.h3`
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: ${({ size }) => size === 'small' ? '1rem' : size === 'medium' ? '1.1rem' : '1.2rem'};
    font-weight: 600;
    margin: 0 0 0.5rem 0;
    text-align: center;
    position: relative;
    z-index: 1;
`;

export const LoadingSubtext = styled.p`
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: ${({ size }) => size === 'small' ? '0.8rem' : size === 'medium' ? '0.85rem' : '0.9rem'};
    margin: 0;
    text-align: center;
    position: relative;
    z-index: 1;
    max-width: 300px;
    line-height: 1.4;
`;

export const ProgressBar = styled.div`
    width: ${({ size }) => size === 'small' ? '150px' : size === 'medium' ? '175px' : '200px'};
    height: 4px;
    background: ${({ theme }) => theme.colors.purple}20;
    border-radius: 2px;
    overflow: hidden;
    margin-top: 1rem;
    position: relative;
    z-index: 1;
`;

export const ProgressFill = styled.div`
    height: 100%;
    background: linear-gradient(90deg, ${({ theme }) => theme.colors.purple}, ${({ theme }) => theme.colors.purple}80);
    border-radius: 2px;
    animation: ${pulse} 1.5s ease-in-out infinite;
    width: 60%;
`;

// Dot loading animation
export const DotContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    margin: 1rem 0;
    position: relative;
    z-index: 1;
`;

export const Dot = styled.div`
    width: 8px;
    height: 8px;
    background: ${({ theme }) => theme.colors.purple};
    border-radius: 50%;
    animation: ${bounce} 1.4s ease-in-out infinite both;
    animation-delay: ${({ delay }) => delay}s;
`;

// Wave loading animation
export const WaveContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 3px;
    margin: 1rem 0;
    position: relative;
    z-index: 1;
`;

export const WaveBar = styled.div`
    width: 4px;
    height: 20px;
    background: ${({ theme }) => theme.colors.purple};
    border-radius: 2px;
    animation: ${wave} 1.2s ease-in-out infinite;
    animation-delay: ${({ delay }) => delay}s;
`;

// Skeleton loading
export const SkeletonContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    max-width: 400px;
    position: relative;
    z-index: 1;
`;

export const SkeletonLine = styled.div`
    height: ${({ height }) => height || '16px'};
    background: linear-gradient(
        90deg,
        ${({ theme }) => theme.colors.purple}20,
        ${({ theme }) => theme.colors.purple}10,
        ${({ theme }) => theme.colors.purple}20
    );
    border-radius: 4px;
    animation: ${pulse} 1.5s ease-in-out infinite;
    width: ${({ width }) => width || '100%'};
`;

export const SkeletonBox = styled.div`
    width: ${({ width }) => width || '100%'};
    height: ${({ height }) => height || '100px'};
    background: linear-gradient(
        90deg,
        ${({ theme }) => theme.colors.purple}20,
        ${({ theme }) => theme.colors.purple}10,
        ${({ theme }) => theme.colors.purple}20
    );
    border-radius: 8px;
    animation: ${pulse} 1.5s ease-in-out infinite;
`;
