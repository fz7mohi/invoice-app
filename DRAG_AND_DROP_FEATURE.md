# Drag and Drop Feature for Quotation Items

## Overview
This feature allows users to drag and reorder items in the Edit Quotation modal. The order is automatically saved when the quotation is submitted.

## Implementation Details

### Components Created

1. **DraggableItem.js** - Individual draggable item component
   - Uses `@dnd-kit/sortable` for drag functionality
   - Includes a drag handle (arrow-up-down icon)
   - Maintains all existing item functionality (edit, delete, etc.)
   - Responsive design for mobile and desktop

2. **SortableItemsContainer.js** - Container for all draggable items
   - Uses `@dnd-kit/core` for drag context
   - Handles drag end events and reordering
   - Manages keyboard and pointer sensors

### Key Features

- **Visual Feedback**: Items show drag state with opacity and rotation
- **Drag Handle**: Clear visual indicator for dragging (arrow-up-down icon)
- **Responsive**: Works on both mobile and desktop
- **Accessibility**: Keyboard navigation support
- **State Management**: Automatic state updates when items are reordered

### Usage

1. Open the Edit Quotation modal
2. In the Item List section, you'll see drag handles (↕️) on the left side of each item
3. Click and drag the handle to reorder items
4. The new order is automatically saved when you submit the quotation

### Technical Implementation

- Uses `@dnd-kit/core` and `@dnd-kit/sortable` libraries
- Integrates with existing state management in `useManageQuotations`
- Maintains all existing validation and calculation logic
- Preserves item data integrity during reordering

### Dependencies Added

```json
{
  "@dnd-kit/core": "^6.0.0",
  "@dnd-kit/sortable": "^7.0.0",
  "@dnd-kit/utilities": "^3.2.0"
}
```

### Files Modified

- `src/components/QuotationFormController/QuotationFormContent.js` - Updated to use new drag and drop components
- `src/hooks/useManageQuotations.js` - No changes needed, existing state management works
- `src/components/shared/Icon/Icon.js` - Uses existing `arrow-up-down` icon

### Browser Support

- Modern browsers with touch and mouse support
- Mobile devices with touch gestures
- Keyboard navigation for accessibility

## Testing

To test the feature:

1. Create or edit a quotation with multiple items
2. Try dragging items to different positions
3. Verify the order is maintained when saving
4. Test on both mobile and desktop devices
5. Verify keyboard navigation works

## Future Enhancements

- Add visual indicators for drop zones
- Implement drag preview with item details
- Add undo/redo functionality for reordering
- Consider adding bulk selection and reordering 