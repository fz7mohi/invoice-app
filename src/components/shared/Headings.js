import { css } from 'styled-components';

const commonStyles = css`
    font-family: 'Spartan', sans-serif;
    font-weight: 600;
`;

export const headingTitle = css`
    ${commonStyles}
    font-size: clamp(1.25rem, 5vw, 2rem);
    letter-spacing: -0.04rem;
    color: ${({ theme }) => theme.colors.textPrimary};
    transition: color 400ms ease-in;

    @media (min-width: 768px) {
        letter-spacing: -0.0625rem;
    }
`;

export const headingLarge = css`
    ${commonStyles}
    font-size: 1.5rem;
    letter-spacing: -0.03125rem;
    line-height: 2.14;
    color: ${({ theme }) => theme.colors.textPrimary};
    transition: color 400ms ease-in-out;
`;

export const headingLargeSmall = css`
    ${commonStyles}
    font-size: clamp(1.25rem, 5vw, 1.5rem);
    letter-spacing: -0.026rem;
    line-height: 2.14;
    color: ${({ theme }) => theme.colors.textPrimary};
    transition: color 400ms ease-in-out;

    @media (min-width: 768px) {
        letter-spacing: -0.03125rem;
    }
`;

export const headingBig = css`
    ${commonStyles}
    font-size: 1.25rem;
    letter-spacing: -0.04rem;
    color: ${({ theme }) => theme.colors.textPrimary};
    transition: color 400ms ease-in-out;
`;

export const headingMedium = css`
    ${commonStyles}
    font-size: 1rem;
    letter-spacing: -0.05rem;
    line-height: 1.5;
    color: ${({ theme }) => theme.colors.textPrimary};
    transition: color 400ms ease-in-out;
`;

export const headingMediumSmall = css`
    ${commonStyles}
    font-size: 0.9375rem;
    letter-spacing: -0.019rem;
    line-height: 1;
    color: ${({ theme }) => theme.colors.textPrimary};
    transition: color 400ms ease-in-out;
`;

export const headingSmall = css`
    ${commonStyles}
    font-size: clamp(0.75rem, 3vw, 1rem);
    letter-spacing: -0.016rem;
    line-height: 1.25;
    color: ${({ theme }) => theme.colors.textPrimary};
    transition: color 400ms ease-in-out;

    @media (min-width: 768px) {
        letter-spacing: -0.05rem;
        line-height: 1.5;
    }
`;

export const headingExtraSmall = css`
    ${commonStyles}
    font-size: 0.75rem;
    letter-spacing: -0.016rem;
    line-height: 1.25;
    color: ${({ theme }) => theme.colors.textPrimary};
    transition: color 400ms ease-in-out;
`;
