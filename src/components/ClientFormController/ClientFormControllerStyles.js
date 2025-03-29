import { motion } from 'framer-motion';
import styled from 'styled-components';

export const StyledClientFormController = styled(motion.div)`
    position: fixed;
    top: clamp(72px, 10.5vw, 80px); /* header height */
    bottom: 0;
    left: 0;
    right: 0; /* Full width on mobile */
    width: 100%; /* Ensure it takes full width */
    background-color: ${({ theme }) => theme.colors.bgForm};
    padding: 32px 24px 190px 24px; /* More consistent padding on mobile */
    transition: background-color 400ms ease-in-out;
    z-index: 99;
    overflow-y: auto;

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

    /* Tablet styles */
    @media (min-width: 768px) {
        left: -20px;
        right: auto; /* Reset right position */
        max-width: 616px;
        border-radius: 0 20px 20px 0;
        padding: 56px 32px 127px 46px;
    }

    /* Desktop styles */
    @media (min-width: 1024px) {
        top: 0;
        max-width: 719px;
        padding: 56px 32px 100px 149px;
    }
`; 