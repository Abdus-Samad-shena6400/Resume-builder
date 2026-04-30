import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const A4_MM = { width: 210, height: 297 };
const DEFAULT_PDF_MARGINS_MM = { top: 10, right: 10, bottom: 10, left: 10 };
const DEFAULT_PDF_SCALE = 0.83; // PDF-only downscale target (0.75–0.85)
const CSS_PX_PER_INCH = 96;
const MM_PER_INCH = 25.4;
const CSS_PX_PER_MM = CSS_PX_PER_INCH / MM_PER_INCH; // ~3.7795

/**
 * Convert image to base64 with proper error handling
 * @param {HTMLImageElement} img - Image element
 * @returns {Promise<string>} Base64 data URL
 */
const convertImageToBase64 = (img) => {
  return new Promise((resolve, reject) => {
    if (img.src.startsWith('data:')) {
      // Already base64
      resolve(img.src);
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    
    try {
      ctx.drawImage(img, 0, 0);
      const base64 = canvas.toDataURL('image/jpeg', 0.95);
      resolve(base64);
    } catch (error) {
      console.error('Error converting image to base64:', error);
      // Return a placeholder or empty string
      resolve('');
    }
  });
};

/**
 * Wait for all images to load and prepare them for PDF
 * @param {HTMLElement} element - Element to check for images
 * @returns {Promise<void>}
 */
const waitForAndConvertImages = async (element) => {
  const images = element.querySelectorAll('img');
  console.log(`Found ${images.length} images to process`);
  
  const imagePromises = Array.from(images).map(async (img, index) => {
    try {
      console.log(`Image ${index} src: ${img.src.substring(0, 100)}...`);
      console.log(`Image ${index} complete: ${img.complete}`);
      
      // If image is already data URL, it should work fine
      if (img.src.startsWith('data:')) {
        console.log(`Image ${index} is already a data URL`);
        return;
      }
      
      // Wait for regular images to load
      if (!img.complete) {
        await new Promise((resolve) => {
          const timeout = setTimeout(() => {
            console.warn(`Image ${index} timed out`);
            resolve();
          }, 10000);
          
          img.onload = () => {
            clearTimeout(timeout);
            console.log(`Image ${index} loaded successfully`);
            resolve();
          };
          
          img.onerror = () => {
            clearTimeout(timeout);
            console.warn(`Image ${index} failed to load`);
            resolve();
          };
        });
      } else {
        console.log(`Image ${index} already complete`);
      }
      
    } catch (error) {
      console.error(`Error processing image ${index}:`, error);
    }
  });
  
  await Promise.all(imagePromises);
  console.log('All images processed');
};

/**
 * Create a clean clone of the resume element for PDF capture
 * @param {HTMLElement} originalElement - Original resume element
 * @returns {HTMLElement} Cleaned clone ready for capture
 */
const createCleanClone = (originalElement, options = {}) => {
  console.log('Creating clean clone for PDF capture');
  const {
    pdfScale = DEFAULT_PDF_SCALE,
    marginsMm = DEFAULT_PDF_MARGINS_MM,
  } = options;

  const pageInnerWidthMm = A4_MM.width - marginsMm.left - marginsMm.right;
  const targetVisualWidthPx = pageInnerWidthMm * CSS_PX_PER_MM;
  // Because transforms do not affect layout sizing, we "pre-inflate" width so the
  // visually-scaled result matches the A4 content width.
  const cloneLayoutWidthPx = Math.round(targetVisualWidthPx / pdfScale);
  
  // Deep clone the element
  const clone = originalElement.cloneNode(true);
  
  // Apply clean styles to the clone
  clone.style.position = 'absolute';
  clone.style.left = '-9999px';
  clone.style.top = '0';
  clone.style.width = `${cloneLayoutWidthPx}px`;
  clone.style.height = 'auto';
  clone.style.overflow = 'visible';
  clone.style.transform = 'none';
  clone.style.opacity = '1';
  clone.style.backgroundColor = '#ffffff';
  clone.style.color = '#000000';
  clone.style.fontFamily = 'Arial, sans-serif';
  
  // Apply PDF-specific scaling (PDF export only; preview remains unchanged)
  clone.style.transform = `scale(${pdfScale})`;
  clone.style.transformOrigin = 'top left';
  clone.dataset.pdfScale = String(pdfScale);
  clone.dataset.pdfTargetVisualWidthPx = String(targetVisualWidthPx);
  
  // Process all child elements
  const allElements = clone.querySelectorAll('*');
  allElements.forEach(el => {
    const computedStyle = window.getComputedStyle(el);
    const bgColor = computedStyle.backgroundColor;
    const isGrayBg = bgColor.includes('rgb(209') || bgColor.includes('rgb(156'); // gray-300 or gray-400
    const borderRadius = computedStyle.borderRadius;
    const isCircular = borderRadius && (borderRadius.includes('50%') || parseFloat(borderRadius) > 10);
    
    // Preserve images
    if (el.tagName === 'IMG') {
      console.log(`Preserving image: ${el.src.substring(0, 80)}...`);
      el.style.display = 'block';
      el.style.visibility = 'visible';
      el.style.opacity = '1';
      el.crossOrigin = 'anonymous';
      return;
    }
    
    // Detect timeline elements by position and appearance (dots and lines)
    const position = computedStyle.position;
    const isAbsolute = position === 'absolute';
    const width = parseFloat(computedStyle.width);
    const height = parseFloat(computedStyle.height);
    
    const isTimelineDot = isAbsolute && width >= 2 && width <= 20 && height >= 2 && height <= 20 && isCircular;
    
    // Timeline lines: thin vertical lines (0.5-2px wide)
    const isTimelineLine = isAbsolute && width <= 2 && height >= 10;
    
    if (isTimelineDot || isTimelineLine) {
      console.log(`Preserving timeline element: dot=${isTimelineDot}, line=${isTimelineLine}, ${el.className}`);
      el.style.display = 'block';
      el.style.visibility = 'visible';
      el.style.opacity = '1';
      el.style.position = 'absolute';
      
      // Preserve all computed positioning and sizing
      const top = computedStyle.top;
      const left = computedStyle.left;
      const styleHeight = el.getAttribute('style')?.match(/height:\s*([^;]+)/)?.[1];
      
      if (top && top !== 'auto') el.style.top = top;
      if (left && left !== 'auto') el.style.left = left;
      if (styleHeight) {
        // Convert calc() values to actual pixel values
        if (styleHeight.includes('calc')) {
          const parent = el.parentElement;
          if (parent) {
            const parentHeight = parent.scrollHeight;
            const heightValue = styleHeight.replace(/calc\(100%\s*([+-])\s*(\d+)px\)/, (match, op, value) => {
              const result = op === '+' ? parentHeight + parseInt(value) : parentHeight - parseInt(value);
              return result + 'px';
            });
            el.style.height = heightValue;
          }
        }
      }
      el.style.backgroundColor = bgColor;
      el.style.borderRadius = borderRadius;
      return;
    }
    
    // Preserve proficiency rating stars in cloned document
    if (el.matches('span') && el.textContent === '★' && 
        (el.classList.contains('text-blue-400') || el.classList.contains('text-yellow-400') || 
         el.classList.contains('text-blue-200') || el.classList.contains('text-yellow-200'))) {
      el.style.display = 'inline';
      el.style.visibility = 'visible';
      el.style.opacity = '1';
      el.style.color = el.style.color || '';
      el.style.fontSize = el.style.fontSize || '';
      el.style.margin = el.style.margin || '';
    }
    
    // For non-timeline absolutely positioned elements, preserve absolute positioning if explicitly defined via tailwind classes or if it is an SVG
    if (isAbsolute && !isTimelineDot && !isTimelineLine) {
      if (el.tagName === 'SVG' || el.tagName === 'svg' || el.classList.contains('absolute') || el.classList.contains('absolute-pdf')) {
        // Keep absolute positioning for SVGs and explicitly absolute tailwind elements
        // (needed for Template 2 background masks, skill circles, etc.)
      } else {
        el.style.position = 'static';
      }
    } else {
      el.style.overflow = 'visible';
    }
    
    el.style.maxHeight = 'none';
    el.style.maxWidth = 'none';
    if (el.tagName !== 'SVG' && el.tagName !== 'svg') {
      el.style.transform = 'none';
    }
    el.style.animation = 'none';
    el.style.transition = 'none';
    el.style.boxShadow = 'none';
    
    // Add page break rules to prevent bad breaks (PDF clone only)
    if (
      el.matches('h1, h2, h3, h4, h5, h6, .space-y-4, .space-y-6, .border-l-4, .bg-gray-50, .bg-blue-50, .bg-indigo-50, .page-break-avoid')
    ) {
      el.style.pageBreakInside = 'avoid';
      el.style.breakInside = 'avoid';
      el.style.pageBreakAfter = 'avoid';
      el.style.breakAfter = 'avoid';
      el.style.pageBreakBefore = 'avoid';
      el.style.breakBefore = 'avoid';
    }
    
    // Reduce spacing for better PDF fitting
    if (el.matches('.space-y-4')) {
      el.style.gap = '0.75rem';
    }
    if (el.matches('.space-y-6')) {
      el.style.gap = '1rem';
    }
    if (el.matches('.p-8')) {
      el.style.padding = '1rem';
    }
    if (el.matches('.p-6')) {
      el.style.padding = '0.75rem';
    }
    if (el.matches('.p-4')) {
      el.style.padding = '0.5rem';
    }
    
    // Slightly reduce font sizes for better fitting
    if (el.matches('h1')) {
      el.style.fontSize = '1.75rem';
    }
    if (el.matches('h2')) {
      el.style.fontSize = '1.25rem';
    }
    if (el.matches('h3')) {
      el.style.fontSize = '1.1rem';
    }
    if (el.matches('p, span, div') && !isTimelineDot && !isTimelineLine) {
      const currentSize = window.getComputedStyle(el).fontSize;
      if (currentSize && currentSize !== '0px') {
        const sizeValue = parseFloat(currentSize);
        el.style.fontSize = (sizeValue * 0.9) + 'px';
      }
    }
    
    // Hide UI elements (but not images or timeline elements)
    if (el.matches('button, [role="button"], input[type="text"], input[type="email"], textarea, select, .template-menu, .ring, .shadow-lg')) {
      el.style.display = 'none';
    }
    
    // Ensure text elements are visible
    if (el.matches('h1, h2, h3, h4, h5, h6, p, span, div') && !isTimelineDot && !isTimelineLine) {
      el.style.display = el.style.display === 'none' ? 'block' : el.style.display;
      el.style.visibility = 'visible';
    }
  });
  
  // Add to body temporarily
  document.body.appendChild(clone);
  
  // Wait for styles to apply
  setTimeout(() => {
    console.log('Clone dimensions after scaling:', clone.scrollWidth, 'x', clone.scrollHeight);
  }, 100);
  
  console.log('Clone created and added to body');
  console.log(`Original dimensions: ${originalElement.scrollWidth}x${originalElement.scrollHeight}`);
  console.log(`Clone layout width px: ${cloneLayoutWidthPx}, pdfScale: ${pdfScale}, target visual width px: ${targetVisualWidthPx}`);
  
  // Log images in clone
  const cloneImages = clone.querySelectorAll('img');
  console.log(`Clone contains ${cloneImages.length} images`);
  cloneImages.forEach((img, i) => {
    console.log(`Image ${i}: ${img.src.substring(0, 80)}...`);
  });
  
  return clone;
};

/**
 * Split canvas into multiple A4 pages
 * @param {jsPDF} pdf - PDF instance
 * @param {HTMLCanvasElement} canvas - Full canvas
 * @param {number} pageWidth - PDF page width in pixels
 * @param {number} pageHeight - PDF page height in pixels
 */
const computeAvoidBreakRangesPx = (clone, domScale, html2canvasScale) => {
  // We rely on templates already marking `.page-break-avoid` on section wrappers + items.
  const avoidEls = Array.from(clone.querySelectorAll('.page-break-avoid'));

  const ranges = avoidEls
    .map((el) => {
      // offsetTop/offsetHeight are *layout* units (not affected by transform), so we apply domScale.
      const top = el.offsetTop * domScale * html2canvasScale;
      const bottom = (el.offsetTop + el.offsetHeight) * domScale * html2canvasScale;
      return { top: Math.max(0, Math.floor(top)), bottom: Math.max(0, Math.ceil(bottom)) };
    })
    .filter((r) => Number.isFinite(r.top) && Number.isFinite(r.bottom) && r.bottom > r.top + 1)
    .sort((a, b) => a.top - b.top);

  // Merge overlaps to keep the adjustment logic fast and stable.
  const merged = [];
  for (const r of ranges) {
    const last = merged[merged.length - 1];
    if (!last || r.top > last.bottom) {
      merged.push({ ...r });
    } else {
      last.bottom = Math.max(last.bottom, r.bottom);
    }
  }
  return merged;
};

const computePageSlicesPx = (canvasHeightPx, sliceHeightPx, avoidRangesPx) => {
  const slices = [];
  const minSlicePx = Math.max(200, Math.floor(sliceHeightPx * 0.4));

  let y = 0;
  while (y < canvasHeightPx - 1) {
    const targetEnd = Math.min(canvasHeightPx, y + sliceHeightPx);
    if (targetEnd >= canvasHeightPx) {
      slices.push({ start: y, end: canvasHeightPx });
      break;
    }

    let adjustedEnd = targetEnd;
    // If the cut line falls inside an "avoid-break" block, nudge the cut upward.
    for (const r of avoidRangesPx) {
      if (r.top < adjustedEnd && r.bottom > adjustedEnd) {
        adjustedEnd = Math.min(adjustedEnd, r.top);
      }
      if (r.top >= adjustedEnd) break;
    }

    // Don’t create an unreasonably tiny page; fall back to the target cut.
    if (adjustedEnd - y < minSlicePx) {
      adjustedEnd = targetEnd;
    }

    // Guard against infinite loops if something goes wrong.
    if (adjustedEnd <= y + 1) {
      adjustedEnd = Math.min(canvasHeightPx, y + sliceHeightPx);
      if (adjustedEnd <= y + 1) break;
    }

    slices.push({ start: y, end: adjustedEnd });
    y = adjustedEnd;
  }

  return slices;
};

const addMultiPageContentA4 = ({
  pdf,
  canvas,
  marginsMm = DEFAULT_PDF_MARGINS_MM,
  avoidRangesPx = [],
}) => {
  const pageInnerWidthMm = A4_MM.width - marginsMm.left - marginsMm.right;
  const pageInnerHeightMm = A4_MM.height - marginsMm.top - marginsMm.bottom;

  const canvasWidthPx = canvas.width;
  const canvasHeightPx = canvas.height;

  // Map canvas pixels → millimeters by fitting to A4 inner width (NOT full-bleed).
  const mmPerPx = pageInnerWidthMm / canvasWidthPx;
  const sliceHeightPx = Math.floor(pageInnerHeightMm / mmPerPx);

  console.log(`Canvas: ${canvasWidthPx}x${canvasHeightPx}px`);
  console.log(`A4 inner: ${pageInnerWidthMm}x${pageInnerHeightMm}mm, mmPerPx=${mmPerPx}, sliceHeightPx=${sliceHeightPx}`);

  const slices = computePageSlicesPx(canvasHeightPx, sliceHeightPx, avoidRangesPx);
  console.log(`PDF pages needed: ${slices.length}`);

  for (let i = 0; i < slices.length; i++) {
    const { start, end } = slices[i];
    const slicePx = end - start;

    if (i > 0) pdf.addPage('a4', 'p');

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvasWidthPx;
    tempCanvas.height = slicePx;
    const ctx = tempCanvas.getContext('2d');

    ctx.drawImage(canvas, 0, start, canvasWidthPx, slicePx, 0, 0, canvasWidthPx, slicePx);

    const imgData = tempCanvas.toDataURL('image/png');
    const renderHeightMm = slicePx * mmPerPx;

    pdf.addImage(
      imgData,
      'PNG',
      marginsMm.left,
      marginsMm.top,
      pageInnerWidthMm,
      renderHeightMm,
      undefined,
      'FAST',
    );
  }
};

/**
 * Production-level PDF generation with comprehensive fixes
 * @param {React.RefObject} contentRef - Reference to the resume preview element
 * @param {string} fileName - Optional filename for the PDF
 * @param {Function} setLoading - Optional function to set loading state
 * @returns {Promise<void>}
 */
export const downloadResumePDF = async (contentRef, fileName = 'resume.pdf', setLoading) => {
  console.log('Starting PDF generation...');
  
  if (!contentRef?.current) {
    console.error('Resume element not found');
    alert('Resume not ready. Please wait.');
    return;
  }

  let clone = null;
  
  try {
    // Set loading state
    if (setLoading) setLoading(true);

    const originalElement = contentRef.current;
    console.log('Original element found:', originalElement);
    
    // Get the actual resume template element
    const resumeTemplate = originalElement.querySelector('.template1, .template2, .template3');
    if (!resumeTemplate) {
      console.error('Resume template not found');
      alert('Resume template not found. Please try again.');
      return;
    }
    
    console.log('Resume template found:', resumeTemplate.className);
    console.log(`Template scroll dimensions: ${resumeTemplate.scrollWidth}x${resumeTemplate.scrollHeight}`);
    console.log(`Template client dimensions: ${resumeTemplate.clientWidth}x${resumeTemplate.clientHeight}`);
    
    // Check for images before processing
    const originalImages = resumeTemplate.querySelectorAll('img');
    console.log(`Original template contains ${originalImages.length} images`);
    originalImages.forEach((img, i) => {
      console.log(`Image ${i}: src=${img.src.substring(0, 80)}..., complete=${img.complete}, naturalWidth=${img.naturalWidth}`);
    });
    
    // Wait for and prepare all images
    await waitForAndConvertImages(resumeTemplate);
    
    // Create clean clone (PDF-only adjustments happen here; preview remains unchanged)
    const marginsMm = DEFAULT_PDF_MARGINS_MM;
    const pdfScale = DEFAULT_PDF_SCALE;
    clone = createCleanClone(resumeTemplate, { pdfScale, marginsMm });
    
    // Wait for clone to render and scaling to apply
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log(`Clone scroll dimensions: ${clone.scrollWidth}x${clone.scrollHeight}`);
    
    // Verify all sections are present
    const sections = clone.querySelectorAll('h2, h3, .space-y-4, .space-y-6');
    console.log(`Found ${sections.length} sections in clone`);
    
    const domScale = Number.parseFloat(clone.dataset.pdfScale || String(DEFAULT_PDF_SCALE));
    const expectedScaledWidth = clone.scrollWidth * domScale;
    const expectedScaledHeight = clone.scrollHeight * domScale;
    console.log(`Expected scaled dimensions: ${expectedScaledWidth}x${expectedScaledHeight}`);
    
    const html2canvasScale = 2; // per requirement: high resolution but stable
    const avoidRangesPx = computeAvoidBreakRangesPx(clone, domScale, html2canvasScale);

    // High-quality canvas capture
    console.log('Starting canvas capture...');
    const canvas = await html2canvas(clone, {
      scale: html2canvasScale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: clone.scrollWidth,
      height: clone.scrollHeight,
      windowWidth: clone.scrollWidth,
      windowHeight: clone.scrollHeight,
      scrollX: 0,
      scrollY: 0,
      foreignObjectRendering: false,
      imageTimeout: 15000,
      removeContainer: false,
      x: 0,
      y: 0,
      onclone: (clonedDoc) => {
        console.log('onclone: Processing images in cloned document');
        // Ensure images are preserved in the clone
        const clonedImages = clonedDoc.querySelectorAll('img');
        const originalImages = clone.querySelectorAll('img');
        
        console.log(`onclone: Found ${clonedImages.length} images in cloned doc`);
        
        clonedImages.forEach((img, index) => {
          const originalImg = originalImages[index];
          
          if (originalImg && originalImg.src) {
            console.log(`onclone: Image ${index} - Original: ${originalImg.src.substring(0, 80)}...`);
            
            // Copy the src - whether it's a data URL or regular URL
            img.src = originalImg.src;
            img.crossOrigin = 'anonymous';
            
            // Ensure image is visible
            img.style.display = 'block';
            img.style.visibility = 'visible';
            img.style.opacity = '1';
            
            console.log(`onclone: Image ${index} - Updated: ${img.src.substring(0, 80)}...`);
          } else if (img.src) {
            console.warn(`onclone: Image ${index} already has src, keeping it`);
          }
        });
        
        // Make sure all elements are visible and maintain page break rules
        const allElements = clonedDoc.querySelectorAll('*');
        allElements.forEach(el => {
          const computedStyle = window.getComputedStyle(el);
          const bgColor = computedStyle.backgroundColor;
          const isGrayBg = bgColor.includes('rgb(209') || bgColor.includes('rgb(156'); // gray-300 or gray-400
          const borderRadius = computedStyle.borderRadius;
          const isCircular = borderRadius && (borderRadius.includes('50%') || parseFloat(borderRadius) > 10);
          const position = computedStyle.position;
          const isAbsolute = position === 'absolute';
          const width = parseFloat(computedStyle.width);
          const height = parseFloat(computedStyle.height);
          
          // Timeline dots: small circles with background
          const isTimelineDot = isAbsolute && width >= 2 && width <= 20 && height >= 2 && height <= 20 && isCircular;
          
          // Timeline lines: thin vertical lines (0.5-2px wide)
          const isTimelineLine = isAbsolute && width <= 2 && height >= 10;
          
          if (el.tagName === 'IMG') {
            el.style.display = 'block';
            el.style.visibility = 'visible';
            el.style.opacity = '1';
          }
          
          // Preserve timeline elements by appearance
          if (isTimelineDot || isTimelineLine) {
            el.style.display = 'block';
            el.style.visibility = 'visible';
            el.style.opacity = '1';
            el.style.position = 'absolute';
            el.style.backgroundColor = bgColor;
            el.style.borderRadius = borderRadius;
            console.log(`onclone: Preserving timeline element: dot=${isTimelineDot}, line=${isTimelineLine}`);
          }
          
          // Re-apply page break rules in the cloned document
          if (el.matches('h1, h2, h3, h4, h5, h6, .space-y-4, .space-y-6, .border-l-4, .bg-gray-50, .bg-blue-50, .bg-indigo-50, .page-break-avoid')) {
            el.style.pageBreakInside = 'avoid';
            el.style.breakInside = 'avoid';
            el.style.pageBreakAfter = 'avoid';
            el.style.breakAfter = 'avoid';
            el.style.pageBreakBefore = 'avoid';
            el.style.breakBefore = 'avoid';
          }
        });
      }
    });
    
    console.log(`Canvas created: ${canvas.width}x${canvas.height}`);
    console.log(`Canvas ready for PDF generation`);
    
    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    addMultiPageContentA4({
      pdf,
      canvas,
      marginsMm: DEFAULT_PDF_MARGINS_MM,
      avoidRangesPx,
    });
    
    // Generate dynamic filename
    const nameElement = clone.querySelector('h1, [data-field="name"], .name');
    let dynamicFileName = fileName;
    if (nameElement) {
      const name = nameElement.textContent?.trim().replace(/\s+/g, '_');
      if (name && name !== '') {
        dynamicFileName = `${name}_resume.pdf`;
      }
    }
    
    // Download PDF
    pdf.save(dynamicFileName);
    console.log('PDF generated successfully:', dynamicFileName);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. Please try again.');
  } finally {
    // Clean up clone
    if (clone && clone.parentNode) {
      clone.parentNode.removeChild(clone);
      console.log('Clone removed from DOM');
    }
    
    if (setLoading) setLoading(false);
    console.log('PDF generation completed');
  }
};

/**
 * Creates a PDF download handler function
 * @param {React.RefObject} contentRef - Reference to the resume preview element
 * @param {string} fileName - Optional filename for the PDF
 * @param {Function} setLoading - Optional function to set loading state
 * @returns {Function} PDF download handler function
 */
export const createPDFDownloadHandler = (contentRef, fileName, setLoading) => {
  return () => downloadResumePDF(contentRef, fileName, setLoading);
};

/**
 * Hook for PDF download functionality (if needed for component integration)
 * @param {React.RefObject} contentRef - Reference to the resume preview element
 * @param {string} fileName - Optional filename for the PDF
 * @returns {Object} PDF download handler and loading state
 */
export const usePDFDownload = (contentRef, fileName = 'resume.pdf') => {
  const [isLoading, setIsLoading] = React.useState(false);
  
  const handleDownload = React.useCallback(() => {
    downloadResumePDF(contentRef, fileName, setIsLoading);
  }, [contentRef, fileName]);
  
  return { handleDownload, isLoading };
};

// Alias to match common naming expectations
export const createPDF = downloadResumePDF;