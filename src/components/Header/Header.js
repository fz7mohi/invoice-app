import { useRef, useState, useEffect } from 'react';
import Icon from '../shared/Icon/Icon';
import { useTheme } from 'styled-components';
import { 
    StyledHeader, 
    Profile, 
    MobileMenuButton,
    MobileNavOverlay,
    MobileNavPanel,
    LogoContainer
} from './HeaderStyles';
import { useGlobalContext } from '../App/context';
import Navigation from '../Navigation/Navigation';
import doxLogo from '../../assets/images/dox-logo.svg';
import { Link } from 'react-router-dom';

const Header = () => {
    const { colors } = useTheme();
    const { discardChanges } = useGlobalContext();
    const isClickable = useRef(true);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
            if (window.innerWidth >= 1024) {
                setMobileNavOpen(false);
            }
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
                {isMobile && (
                    <>
                        <LogoContainer>
                            <Link to="/dashboard">
                                <img src={doxLogo} alt="Dox Logo" />
                            </Link>
                        </LogoContainer>
                        <MobileMenuButton 
                            aria-label="Toggle mobile menu" 
                            onClick={toggleMobileNav}
                        >
                            <Icon 
                                name="menu" 
                                size={24} 
                                color={colors.textSecondary}
                            />
                        </MobileMenuButton>
                    </>
                )}
                {!isMobile && (
                    <>
                        <Navigation onNavigate={closeMobileNav} />
                        <Profile />
                    </>
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
