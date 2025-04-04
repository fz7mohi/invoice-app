import { IconBaseProps } from 'react-icons';
import { 
    IoArrowDown, 
    IoArrowForward, 
    IoCheckmark, 
    IoAdd,
    IoImage,
    IoLogoGithub
} from 'react-icons/io5';

const iconMap = {
    'arrow-down': IoArrowDown,
    'arrow-right': IoArrowForward,
    'check': IoCheckmark,
    'plus': IoAdd,
    'image': IoImage,
    'logo': IoLogoGithub
};

const Icon = ({ name, size, color, customStyle, ...props }) => {
    const IconComponent = iconMap[name];
    
    if (!IconComponent) {
        console.warn(`Icon "${name}" not found`);
        return null;
    }

    return (
        <IconComponent
            size={size}
            color={color}
            style={customStyle}
            {...props}
        />
    );
};

export default Icon;
