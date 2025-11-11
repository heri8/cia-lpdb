// src/hooks/useDebounce.js

import { useState, useEffect } from "react";

// Hook yang menunda pembaruan nilai (value) selama periode waktu (delay) tertentu
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Atur timer untuk memperbarui debouncedValue setelah delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Bersihkan timer setiap kali value berubah (atau hook dilepas)
    // Ini penting agar hanya pemanggilan terakhir yang dieksekusi
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Hanya jalankan ulang jika value atau delay berubah

  return debouncedValue;
}

export default useDebounce;
