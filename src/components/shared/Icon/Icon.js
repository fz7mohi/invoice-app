import { IconBaseProps } from 'react-icons';
import * as Icons from 'react-icons/all';

const Icon = ({ name, size, color, customStyle, ...props }) => {
    const IconComponent = Icons[name];
    
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
