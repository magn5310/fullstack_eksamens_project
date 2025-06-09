import React from "react";
import { UseFormRegister, FieldError, FieldValues, Path } from "react-hook-form";

interface FormFieldProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  type?: string;
  register: UseFormRegister<T>;
  error?: FieldError;
  placeholder?: string;
}

export function FormField<T extends FieldValues>({ label, name, type, register, error, placeholder }: FormFieldProps<T>) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input type={type} {...register(name)} placeholder={placeholder} className="mt-1 block w-full rounded-sm border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2" />
      {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
    </div>
  );
}
