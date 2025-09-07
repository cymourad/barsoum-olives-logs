import { useState, useEffect } from 'react';

/**
 * Custom hook that debounces a value
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Custom hook for debounced input handling with immediate UI updates
 * @param initialValue - Initial value
 * @param onDebouncedChange - Callback function called with debounced value
 * @param delay - Debounce delay in milliseconds (default: 500ms)
 * @returns Object with displayValue and onChange handler
 */
export function useDebouncedInput(
  initialValue: string,
  onDebouncedChange: (value: string) => void,
  delay: number = 500
) {
  const [displayValue, setDisplayValue] = useState(initialValue);
  const debouncedValue = useDebounce(displayValue, delay);

  // Update display value when initial value changes (e.g., from props)
  useEffect(() => {
    setDisplayValue(initialValue);
  }, [initialValue]);

  // Call the debounced change handler when debounced value changes
  useEffect(() => {
    if (debouncedValue !== initialValue) {
      onDebouncedChange(debouncedValue);
    }
  }, [debouncedValue, onDebouncedChange, initialValue]);

  const handleChange = (value: string) => {
    setDisplayValue(value);
  };

  return {
    displayValue,
    onChange: handleChange,
  };
}
