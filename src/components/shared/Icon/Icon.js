import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faArrowDown, 
    faArrowRight, 
    faArrowLeft,
    faArrowUp,
    faArrowsAltV,
    faCheck, 
    faPlus,
    faImage,
    faBars,
    faUsers,
    faFileInvoice,
    faFileInvoiceDollar,
    faReceipt,
    faTruck,
    faCog,
    faSearch,
    faFileAlt,
    faCalendar,
    faTimes,
    faTrash,
    faMapMarkerAlt,
    faDownload,
    faEnvelope,
    faCopy,
    faEdit,
    faChevronLeft,
    faChevronRight,
    faChevronUp,
    faChevronDown,
    faSpinner
} from '@fortawesome/free-solid-svg-icons';

const iconMap = {
    'arrow-down': faArrowDown,
    'arrow-right': faArrowRight,
    'arrow-left': faArrowLeft,
    'arrow-up': faArrowUp,
    'arrow-up-down': faArrowsAltV,
    'check': faCheck,
    'plus': faPlus,
    'image': faImage,
    'logo': faImage,
    'menu': faBars,
    'clients': faUsers,
    'quotation': faFileInvoice,
    'invoice': faFileInvoiceDollar,
    'receipt': faReceipt,
    'delivery': faTruck,
    'settings': faCog,
    'search': faSearch,
    'statement': faFileAlt,
    'calendar': faCalendar,
    'close': faTimes,
    'delete': faTrash,
    'trash': faTrash,
    'map': faMapMarkerAlt,
    'download': faDownload,
    'mail': faEnvelope,
    'copy': faCopy,
    'edit': faEdit,
    'chevron-left': faChevronLeft,
    'chevron-right': faChevronRight,
    'chevron-up': faChevronUp,
    'chevron-down': faChevronDown,
    'x': faTimes,
    'spinner': faSpinner,
    'loading': faSpinner
};

const getFontAwesomeSize = (size) => {
    if (typeof size === 'string') {
        return size;
    }
    
    // Convert numeric sizes to FontAwesome size format
    const sizeMap = {
        16: '1x',
        24: '2x',
        32: '3x',
        40: '4x',
        48: '5x',
        56: '6x',
        64: '7x',
        72: '8x',
        80: '9x',
        88: '10x'
    };
    
    return sizeMap[size] || '1x';
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
            size={getFontAwesomeSize(size)}
            color={color}
            style={customStyle}
            {...props}
        />
    );
};

export default Icon;
