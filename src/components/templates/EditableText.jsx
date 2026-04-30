import { useEffect, useRef, useCallback } from "react";

const EditableText = ({
  as: Component = "span",
  value = "",
  onChange,
  isEditMode = false,
  placeholder = "",
  className = "",
  multiline = false,
}) => {
  const elementRef = useRef(null);
  const lastValueRef = useRef(value);
  const timeoutRef = useRef(null);

  // Only update content if it's different and element is not focused
  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;
    const currentValue = element.textContent || "";
    const nextValue = value ?? "";

    // Only update if value changed and element is not focused
    if (currentValue !== nextValue && document.activeElement !== element) {
      element.textContent = nextValue;
      lastValueRef.current = nextValue;
    }
  }, [value]);

  const handleChange = useCallback((immediate = false) => {
    if (!elementRef.current || !onChange) return;

    const rawValue = elementRef.current.textContent ?? "";
    const nextValue = multiline ? rawValue : rawValue.replace(/\n/g, " ");

    // Only call onChange if value actually changed
    if (nextValue !== lastValueRef.current) {
      lastValueRef.current = nextValue;
      
      if (immediate) {
        onChange(nextValue);
      } else {
        // Debounce rapid changes while typing
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          onChange(nextValue);
        }, 150);
      }
    }
  }, [onChange, multiline]);

  const handleInput = useCallback(() => {
    // Save current cursor position
    const selection = window.getSelection();
    const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
    const cursorOffset = range?.startOffset || 0;
    
    // Update state immediately for real-time sync
    handleChange(true);
    
    // Restore cursor position after state update
    setTimeout(() => {
      try {
        if (range && elementRef.current) {
          const newRange = document.createRange();
          const textNode = elementRef.current.firstChild;
          if (textNode && textNode.nodeType === Node.TEXT_NODE) {
            const offset = Math.min(cursorOffset, textNode.textContent.length);
            newRange.setStart(textNode, offset);
            newRange.setEnd(textNode, offset);
            selection?.removeAllRanges();
            selection?.addRange(newRange);
          }
        }
      } catch (e) {
        // Ignore cursor restoration errors
      }
    }, 0);
  }, [handleChange]);

  const handleBlur = useCallback(() => {
    // Clear any pending timeout and update immediately
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    handleChange(true);
  }, [handleChange]);

  const handleKeyDown = (event) => {
    if (!multiline && event.key === "Enter") {
      event.preventDefault();
      elementRef.current?.blur();
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <Component
      ref={elementRef}
      contentEditable={isEditMode}
      suppressContentEditableWarning
      spellCheck={isEditMode}
      tabIndex={isEditMode ? 0 : undefined}
      data-placeholder={placeholder}
      onInput={handleInput}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={`${className} ${
        isEditMode
          ? "cursor-text rounded-sm outline-none transition-all duration-200 "
          : ""
      }`}
    >
      {value ?? ""}
    </Component>
  );
};

export default EditableText;
