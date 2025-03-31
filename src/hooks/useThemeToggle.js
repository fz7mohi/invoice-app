import { useState, useEffect } from 'react';

const lightTheme = 'light';
const darkTheme = 'dark';

/**
 * Function to get theme value from localStorage.
 * @return   {string}    Name of preferred theme
 */
const getThemeFromLocalStorage = () => {
    return localStorage.getItem('theme');
};

/**
 * Function to post to localStorage user preferred theme.
 * @param    {string} newTheme    Theme name to post
 */
const postThemeToLocalStorage = (newTheme) => {
    localStorage.setItem('theme', newTheme);
};

/**
 * Function to get user preferred theme based on their os/browser setttings.
 * @return   {string}    Name of preferred theme
 */
const getUserPreferredTheme = () => {
    const isUserPrefersDark =
        window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return isUserPrefersDark ? darkTheme : lightTheme;
};

/**
 * Function to apply theme to document
 * @param    {string} theme    Theme name to apply
 */
const applyThemeToDocument = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.classList.toggle('dark-theme', theme === darkTheme);
};

/**
 * Custom hook to toggle themes. Initially, it sets the user's preferred theme
 * @return   {string}    Name of preferred theme.
 * @return   {function}    Function to toggle theme.
 */
const useThemeToggle = () => {
    const [theme, setTheme] = useState(
        () => getThemeFromLocalStorage() || getUserPreferredTheme()
    );

    /**
     * Apply theme changes to localStorage and document
     */
    useEffect(() => {
        postThemeToLocalStorage(theme);
        applyThemeToDocument(theme);
    }, [theme]);

    /**
     * Handle function to toggle between themes.
     */
    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === lightTheme ? darkTheme : lightTheme);
    };

    return { theme, toggleTheme };
};

export default useThemeToggle;
