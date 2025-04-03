import { useRef, useState, useEffect } from 'react';
import Icon from '../shared/Icon/Icon';
import { useTheme } from 'styled-components';
import { 
    StyledHeader, 
    Logo, 
    Profile, 
    MobileMenuButton,
    MobileNavOverlay,
    MobileNavPanel
} from './HeaderStyles';
import { useGlobalContext } from '../App/context';
import Navigation from '../Navigation/Navigation';

const Header = () => {
    const { colors } = useTheme();
    const { discardChanges } = useGlobalContext();
    const isClickable = useRef(true);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
            // Close mobile nav when resizing to desktop
            if (window.innerWidth >= 1024) {
                setMobileNavOpen(false);
            }
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Function to prevent too fast clicking on Logo since it was causing a bug
    // with Framer Motion where two fast clicks cause that component Invoices doesn't render.
    const handleClick = (event) => {
        if (!isClickable.current) {
            event.preventDefault();
        } else {
            isClickable.current = false;
            setTimeout(() => (isClickable.current = true), 1000);
            discardChanges();
        }
    };

    const toggleMobileNav = () => {
        setMobileNavOpen(!mobileNavOpen);
    };

    const closeMobileNav = () => {
        setMobileNavOpen(false);
    };

    return (
        <>
            <StyledHeader>
                <Logo aria-label="Home Page" to="/" onClick={handleClick} />
                <Navigation onNavigate={closeMobileNav} />
                {isMobile ? (
                    <MobileMenuButton 
                        aria-label="Toggle mobile menu" 
                        onClick={toggleMobileNav}
                    >
                        <Icon 
                            name="menu" 
                            size={24} 
                            color="#FFFFFF"
                        />
                    </MobileMenuButton>
                ) : (
                    <Profile />
                )}
            </StyledHeader>

            {mobileNavOpen && (
                <>
                    <MobileNavOverlay onClick={closeMobileNav} />
                    <MobileNavPanel>
                        <Profile isMobile />
                        <Navigation isMobile onNavigate={closeMobileNav} />
                    </MobileNavPanel>
                </>
            )}
        </>
    );
};

export default Header;
