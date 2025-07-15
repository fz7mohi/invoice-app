Here’s a **detailed plan** to implement multi-page PDF support for your Quotation and Invoice PDF generation, while keeping your current stack (`html2canvas` + `jsPDF`) and design as intact as possible.

---

## 1. **Understand the Limitation**

- **html2canvas** renders a single DOM element to a single canvas, limited by the element’s height.
- **jsPDF** adds that canvas as an image to a single PDF page.
- If your content is taller than one page, the overflow is lost.

---

## 2. **High-Level Solution**

- **Paginate** your content: break the items table (and any other long content) into page-sized chunks.
- For each chunk:
  - Render a page-sized container to a canvas.
  - Add that canvas as a new page in the PDF.
- Repeat until all content is included.

---

## 3. **Detailed Steps**

### **A. Calculate Page Height in Pixels**

- A3 at 96 DPI:  
  - Height = 420mm × (96/25.4) ≈ **1587 pixels**
  - Width = 297mm × (96/25.4) ≈ **1122 pixels**
- Use these values to size your containers and canvases.

---

### **B. Split Items into Page-Sized Chunks**

- Estimate how many items fit on one page (based on row height and available space after header/client/total sections).
- Write a function to split your `quotation.items` or `invoice.items` into arrays, each representing one page.

---

### **C. Generate a Container for Each Page**

- For each chunk:
  - Create a new DOM container.
  - Add the header, client section, and only the items for that page.
  - Add the total section only on the last page.
  - Add the signature section only on the last page (optional).

---

### **D. Render Each Page to Canvas**

- For each container:
  - Add it to the DOM (off-screen).
  - Use `html2canvas` to render it to a canvas.
  - Remove the container from the DOM.

---

### **E. Add Each Canvas to the PDF**

- For the first canvas:
  - Create a new `jsPDF` document.
  - Add the image to the first page.
- For each subsequent canvas:
  - Add a new page to the PDF.
  - Add the image to the new page.

---

### **F. Save or Export the PDF**

- Save the PDF as usual.

---

## 4. **Implementation Tips**

- **Reusable Functions:**  
  - Write a function to generate a page container given a chunk of items and a flag for “isLastPage”.
- **Consistent Layout:**  
  - Ensure headers and footers are consistent across pages.
- **Avoid Content Cutoff:**  
  - Don’t split a table row between pages.
- **Performance:**  
  - Rendering multiple canvases can be slow; show a loading indicator.

---

## 5. **Optional Enhancements**

- **Dynamic Row Height:**  
  - If item descriptions can be long, measure row heights dynamically.
- **Page Numbers:**  
  - Add a footer with “Page X of Y”.
- **Print Styles:**  
  - Use CSS to hide/show elements as needed for PDF output.

---

## 6. **Pseudocode Example**

```js
const PAGE_HEIGHT_PX = 1587; // A3 at 96 DPI
const itemsPerPage = calculateItemsPerPage(); // Based on your row height and layout

const itemChunks = splitItemsIntoPages(quotation.items, itemsPerPage);

const pdf = new jsPDF({ ... });

for (let i = 0; i < itemChunks.length; i++) {
  const container = createPageContainer(itemChunks[i], i === itemChunks.length - 1);
  document.body.appendChild(container);
  const canvas = await html2canvas(container, { ... });
  document.body.removeChild(container);

  const imgData = canvas.toDataURL('image/png');
  if (i > 0) pdf.addPage();
  pdf.addImage(imgData, 'PNG', 0, 0, 297, 420);
}

pdf.save('Quotation.pdf');
```

---

## 7. **Summary Table**

| Step                | What to Do                                      |
|---------------------|-------------------------------------------------|
| 1. Calculate height | Know your page size in pixels                   |
| 2. Split items      | Divide items into page-sized chunks             |
| 3. Create container | For each chunk, build a page container          |
| 4. Render canvas    | Use html2canvas for each container              |
| 5. Add to PDF       | Add each canvas as a new page in jsPDF          |
| 6. Save             | Save/export the PDF as usual                    |

---

