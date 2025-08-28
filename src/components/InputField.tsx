import Image from "next/image";
import React from "react";
import { FieldError } from "react-hook-form";

interface InputFieldProps {
  label: string;
  type?: string;
  name: string;
  placeholder?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: any;
  error?: FieldError;
  defaultValue?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

export default function InputField({
  label,
  type = "text",
  name,
  placeholder,
  register,
  error,
  defaultValue,
  inputProps,
}: InputFieldProps) {
  if (label === 'Sex') {
    return (
      <div className="flex flex-col gap-2 w-full md:w-1/4">
        <label className="text-xs text-gray-500">{label}</label>
        <select
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
          {...register(name)}
          defaultValue={defaultValue}
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        {error?.message && (
          <p className="text-red-400 text-xs">{error?.message}</p>
        )}
      </div>
    );
  }

  else if (label === 'Image') {
    return (
      <div className="flex flex-col gap-2 w-full md:w-1/4">
        <label className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer" htmlFor="img">
          <Image src={'/upload.png'} alt="upload" width={28} height={28} />
          <span>Upload a photo</span>
        </label>
        <input
          id="img"
          type='file'
          {...register(name)}
          className="hidden"
        />
        {error?.message && (
          <p className="text-red-400 text-xs">{error?.message}</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 w-full md:w-1/4">
      <label className="text-xs text-gray-500">{label}</label>
      <input
        type={type}
        {...register(name)}
        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
        {...inputProps}
        defaultValue={defaultValue}
      />
      {error?.message && (
        <p className="text-red-400 text-xs">{error?.message}</p>
      )}
    </div>
  );
}
