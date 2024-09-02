import { useEffect, useState } from 'react';

interface UseDebounceProps {
  value: any;
  delay: number;
}

export const useDebounce = ({ value, delay }: UseDebounceProps) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timerID = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timerID);
    };
  }, [value, delay]);

  return debouncedValue;
};
