import styled from 'styled-components';
import { motion } from 'framer-motion';

export const StyledQuotationFormController = styled(motion.div)`
    position: fixed;
    top: clamp(72px, 10.5vw, 80px); /* header height */
    bottom: 0;
    left: -20px;
    background-color: ${({ theme }) => theme.colors.bgForm};
    padding: 32px 4px 190px 44px;
    transition: background-color 400ms ease-in-out;
    z-index: 99;
    width: 100%;
    overscroll-behavior: contain;
    overflow-y: auto;
    overflow-x: hidden;

    &::before {
        position: absolute;
        content: '';
        bottom: 0;
        left: 0;
        right: 0;
        height: 190px;
        background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.1),
            rgba(0, 0, 0, 0) 100%
        );
        z-index: 2;
        pointer-events: none;
    }

    @media (min-width: 700px) {
        max-width: 616px;
        border-radius: 0 20px 20px 0;
        overflow: hidden;
        padding: 56px 32px 127px 46px;
    }

    @media (min-width: 1024px) {
        max-width: 719px;
        padding: 56px 32px 100px 149px;
        top: 0;
    }
`; 