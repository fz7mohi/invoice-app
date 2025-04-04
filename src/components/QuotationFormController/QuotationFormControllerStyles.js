import styled from 'styled-components';
import { motion } from 'framer-motion';

export const StyledQuotationFormController = styled(motion.div)`
    position: fixed;
    top: clamp(72px, 10.5vw, 80px); /* header height */
    bottom: 0;
    left: -20px;
    background-color: #1E2139;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 32px 24px 190px 44px;
    z-index: 99;
    width: 100%;
    overscroll-behavior: contain;
    overflow-y: auto;
    overflow-x: hidden;

    /* Form elements styling */
    input, select, textarea {
        background-color: #1E2139 !important;
        border: 1px solid rgb(132, 136, 168) !important;
        color: #FFFFFF !important;

        &::placeholder {
            color: #DFE3FA !important;
        }

        &:focus {
            border-color:rgb(179, 165, 232) !important;
        }
    }

    label {
        color: #DFE3FA !important;
    }

    h1, h2, h3, h4, h5, h6, p, span {
        color: #FFFFFF !important;
    }

    &::before {
        position: absolute;
        content: '';
        bottom: 0;
        left: 0;
        right: 0;
        height: 190px;
        background: linear-gradient(
            to top,
            #1E2139 20%,
            transparent 100%
        );
        z-index: 2;
        pointer-events: none;
    }

    @media (min-width: 700px) {
        max-width: 720px;
        border-radius: 0 20px 20px 0;
        overflow: hidden;
        padding: 56px 40px 127px 46px;
    }

    @media (min-width: 1024px) {
        max-width: 900px;
        padding: 56px 60px 100px 149px;
        top: 0;
    }
    
    @media (min-width: 1440px) {
        max-width: 1000px;
        padding: 56px 70px 100px 159px;
    }
`; 