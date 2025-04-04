import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faArrowDown, 
    faArrowRight, 
    faCheck, 
    faPlus,
    faImage,
    faGithub
} from '@fortawesome/free-solid-svg-icons';

const iconMap = {
    'arrow-down': faArrowDown,
    'arrow-right': faArrowRight,
    'check': faCheck,
    'plus': faPlus,
    'image': faImage,
    'logo': faGithub
};

const Icon = ({ name, size, color, customStyle, ...props }) => {
    const icon = iconMap[name];
    
    if (!icon) {
        console.warn(`Icon "${name}" not found`);
        return null;
    }

    return (
        <FontAwesomeIcon
            icon={icon}
            size={size}
            color={color}
            style={customStyle}
            {...props}
        />
    );
};

export default Icon;
