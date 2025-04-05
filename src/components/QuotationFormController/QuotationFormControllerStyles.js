import styled from 'styled-components';
import { motion } from 'framer-motion';

export const StyledQuotationFormController = styled(motion.div)`
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #1E2139;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 99;
    width: 100%;
    height: 100%;
    overscroll-behavior: contain;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;

    // Mobile-first padding
    padding: 16px;
    padding-bottom: calc(80px + env(safe-area-inset-bottom)); // Account for bottom safe area
    
    // Form elements styling
    input, select, textarea {
        background-color: #1E2139 !important;
        border: 1px solid rgb(132, 136, 168) !important;
        color: #FFFFFF !important;
        font-size: 16px; // Prevent zoom on iOS
        min-height: 48px; // Minimum touch target size

        &::placeholder {
            color: #DFE3FA !important;
            opacity: 0.7;
        }

        &:focus {
            border-color: rgb(179, 165, 232) !important;
            outline: none;
            box-shadow: 0 0 0 2px rgba(124, 93, 250, 0.1);
        }
    }

    label {
        color: #DFE3FA !important;
        font-size: 14px;
        margin-bottom: 8px;
    }

    h1, h2, h3, h4, h5, h6, p, span {
        color: #FFFFFF !important;
    }

    // Bottom gradient for better readability
    &::before {
        position: fixed;
        content: '';
        bottom: 0;
        left: 0;
        right: 0;
        height: 120px;
        background: linear-gradient(
            to top,
            #1E2139 20%,
            transparent 100%
        );
        z-index: 2;
        pointer-events: none;
    }

    // Tablet
    @media (min-width: 768px) {
        max-width: 720px;
        left: 80px; // Sidebar width
        border-radius: 0 20px 20px 0;
        padding: 32px 40px;
        padding-bottom: calc(100px + env(safe-area-inset-bottom));
    }

    // Desktop
    @media (min-width: 1024px) {
        max-width: 900px;
        padding: 40px 60px;
        padding-bottom: calc(120px + env(safe-area-inset-bottom));
    }
    
    // Large Desktop
    @media (min-width: 1440px) {
        max-width: 1000px;
        padding: 40px 70px;
    }

    // Custom scrollbar
    &::-webkit-scrollbar {
        width: 8px;
    }

    &::-webkit-scrollbar-track {
        background: #1E2139;
    }

    &::-webkit-scrollbar-thumb {
        background: #252945;
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: #7C5DFA;
    }
`; 