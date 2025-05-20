import type{ ChangeEvent } from "react";

// Generic handler for flat string, number, or boolean fields
export const handleChange = <T>(
  setter: React.Dispatch<React.SetStateAction<T>>
) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  const { name, value, type } = e.target;
  const checked = type === "checkbox" && (e.target as HTMLInputElement).checked;
  setter(prev => ({
    ...prev,
    [name]: type === "checkbox" ? checked : value,
  }));
};

// For updating nested objects
export const handleObjectChange = <T, K extends keyof T>(
  setter: React.Dispatch<React.SetStateAction<T>>,
  objectKey: K
) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  const { name, value, type } = e.target;
  const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
  setter(prev => ({
    ...prev,
    [objectKey]: {
      ...prev[objectKey],
      [name]: type === "checkbox" ? checked : value,
    },
  }));
};

// For updating array of objects by index
export const handleArrayChange = <T, K extends keyof T>(
  setter: React.Dispatch<React.SetStateAction<T>>,
  arrayKey: K,
  index: number
) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  const { name, value, type } = e.target;
  const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

  setter(prev => ({
    ...prev,
    [arrayKey]: (prev[arrayKey] as any[]).map((item, i) =>
      i === index ? { ...item, [name]: type === "checkbox" ? checked : value } : item
    ),
  }));
};

// Add item to an array
export const addArrayItem = <T, K extends keyof T>(
  setter: React.Dispatch<React.SetStateAction<T>>,
  arrayKey: K,
  newItem: any
) => {
  setter(prev => ({
    ...prev,
    [arrayKey]: [...(prev[arrayKey] as any[] || []), newItem],
  }));
};

// Remove item from an array
export const removeArrayItem = <T, K extends keyof T>(
  setter: React.Dispatch<React.SetStateAction<T>>,
  arrayKey: K,
  index: number
) => {
  setter(prev => ({
    ...prev,
    [arrayKey]: (prev[arrayKey] as any[]).filter((_, i) => i !== index),
  }));
};
