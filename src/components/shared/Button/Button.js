import { StyledButton } from './ButtonStyles';
import Icon from '../Icon/Icon';

const Button = ({ children, icon, text, ...props }) => {
    return (
        <StyledButton {...props}>
            {icon && <Icon name={icon} size={16} color="#fff" />}
            {text && <span>{text}</span>}
            {children}
        </StyledButton>
    );
};

export default Button;
