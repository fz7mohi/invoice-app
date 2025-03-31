import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  :root {
    --color-purple: #7c5dfa;
    --color-purple-light: #9277ff;
    --color-red: #ec5757;
    --color-red-light: #ff9797;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-family: 'Spartan', sans-serif;
    font-size: 62.5%;
    scroll-behavior: smooth;
  }

  body {
    font-size: 1.2rem;
    font-weight: 500;
    line-height: 1.5;
    letter-spacing: -0.25px;
    color: ${({ theme }) => theme.colors.textPrimary};
    background-color: ${({ theme }) => theme.colors.background};
    transition: color 400ms ease-in-out, background-color 400ms ease-in-out;
  }

  h1, h2, h3, h4 {
    font-weight: 700;
    line-height: 1.1;
    margin-bottom: 1.6rem;
  }

  h1 {
    font-size: 2rem;
    letter-spacing: -1px;
    color: ${({ theme }) => theme.colors.textPrimary};

    @media (min-width: 768px) {
      font-size: 2.4rem;
    }
  }

  h2 {
    font-size: 1.5rem;
    letter-spacing: -0.75px;
    color: ${({ theme }) => theme.colors.textPrimary};

    @media (min-width: 768px) {
      font-size: 2rem;
    }
  }

  h3 {
    font-size: 1.2rem;
    letter-spacing: -0.63px;
    color: ${({ theme }) => theme.colors.textPrimary};

    @media (min-width: 768px) {
      font-size: 1.6rem;
    }
  }

  h4 {
    font-size: 1.2rem;
    letter-spacing: -0.25px;
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  /* Data theme attributes for additional CSS control */
  [data-theme="dark"] {
    --color-bg-main: ${({ theme }) => theme.colors.background};
    --color-bg-card: ${({ theme }) => theme.colors.backgroundItem};
    --color-bg-input: ${({ theme }) => theme.colors.bgInput};
    --color-text-primary: ${({ theme }) => theme.colors.textPrimary};
    --color-text-secondary: ${({ theme }) => theme.colors.textSecondary};
    --color-border: ${({ theme }) => theme.colors.bgInputBorder};
  }

  [data-theme="light"] {
    --color-bg-main: ${({ theme }) => theme.colors.background};
    --color-bg-card: ${({ theme }) => theme.colors.backgroundItem};
    --color-bg-input: ${({ theme }) => theme.colors.bgInput};
    --color-text-primary: ${({ theme }) => theme.colors.textPrimary};
    --color-text-secondary: ${({ theme }) => theme.colors.textSecondary};
    --color-border: ${({ theme }) => theme.colors.bgInputBorder};
  }

  /* Add a focus style for accessibility */
  :focus-visible {
    outline: 2px dashed var(--color-purple);
    outline-offset: 2px;
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.textSecondary};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--color-purple);
  }
`;

export default GlobalStyle; 