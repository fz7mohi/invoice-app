import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

// Spinning animation
const spin = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`;

// Pulse animation for the background
const pulse = keyframes`
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.8; }
`;

// Fade in animation
const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
`;

const LoadingContainer = styled(motion.div)`
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

const SpinnerContainer = styled.div`
    position: relative;
    z-index: 1;
    margin-bottom: 1.5rem;
`;

const Spinner = styled.div`
    width: 48px;
    height: 48px;
    border: 4px solid ${({ theme }) => theme.colors.purple}20;
    border-top: 4px solid ${({ theme }) => theme.colors.purple};
    border-radius: 50%;
    animation: ${spin} 1s linear infinite;
    margin-bottom: 1rem;
`;

const LoadingText = styled(motion.h3)`
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 1.2rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
    text-align: center;
    position: relative;
    z-index: 1;
`;

const LoadingSubtext = styled(motion.p)`
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 0.9rem;
    margin: 0;
    text-align: center;
    position: relative;
    z-index: 1;
    max-width: 300px;
    line-height: 1.4;
`;

const ProgressBar = styled.div`
    width: 200px;
    height: 4px;
    background: ${({ theme }) => theme.colors.purple}20;
    border-radius: 2px;
    overflow: hidden;
    margin-top: 1rem;
    position: relative;
    z-index: 1;
`;

const ProgressFill = styled.div`
    height: 100%;
    background: linear-gradient(90deg, ${({ theme }) => theme.colors.purple}, ${({ theme }) => theme.colors.purple}80);
    border-radius: 2px;
    animation: ${pulse} 1.5s ease-in-out infinite;
    width: 60%;
`;

const LoadingPage = ({ 
    title = "Loading...", 
    subtitle = "Please wait while we fetch your data", 
    showProgress = true,
    size = "large" 
}) => {
    const containerVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { 
            opacity: 1, 
            scale: 1,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        },
        exit: { 
            opacity: 0, 
            scale: 0.95,
            transition: {
                duration: 0.2,
                ease: "easeIn"
            }
        }
    };

    const textVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: {
                delay: 0.2,
                duration: 0.3
            }
        }
    };

    const progressVariants = {
        hidden: { opacity: 0, scaleX: 0 },
        visible: { 
            opacity: 1, 
            scaleX: 1,
            transition: {
                delay: 0.4,
                duration: 0.3
            }
        }
    };

    return (
        <LoadingContainer
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <SpinnerContainer>
                <Spinner />
            </SpinnerContainer>
            
            <LoadingText
                variants={textVariants}
                initial="hidden"
                animate="visible"
            >
                {title}
            </LoadingText>
            
            <LoadingSubtext
                variants={textVariants}
                initial="hidden"
                animate="visible"
            >
                {subtitle}
            </LoadingSubtext>
            
            {showProgress && (
                <ProgressBar>
                    <ProgressFill
                        variants={progressVariants}
                        initial="hidden"
                        animate="visible"
                    />
                </ProgressBar>
            )}
        </LoadingContainer>
    );
};

export default LoadingPage;
