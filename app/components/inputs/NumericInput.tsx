'use client'
import { useCallback, ChangeEvent } from "react";
import { 
  FieldErrors, 
  FieldValues, 
  UseFormRegister 
} from "react-hook-form";
import { BiDollar } from "react-icons/bi";

interface NumberInputProps {
  id: string;
  subtitle: string;
  value: number;
  suffix?: string;
  type?: string;
  disabled?: boolean;
  placeholder?: string;
  onChange: (value: number) => void;
  required?: boolean;
  register: UseFormRegister<FieldValues>,
  errors: FieldErrors
}

const NumberInput: React.FC<NumberInputProps> = ({
  id,
  subtitle,
  value,
  placeholder,
  onChange,
  disabled,
  type,
  suffix,
  required,
  register,
  errors,

}) => {
  const formatValue = (value: number) => {
    return value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") : "";
  };
  
  
  const parseValue = (valueString: string) => {
    return parseInt(valueString.replace(/\s/g, ""), 10);
  };

  const onInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const inputValue = parseValue(event.target.value);
      if (!isNaN(inputValue)) {
        onChange(inputValue);
      }
    },
    [onChange]
  );


  return (
    <div className="flex flex-row items-center justify-between">
      <div className="flex flex-col">
        <div className="font-medium">{id}</div>
        <div className="font-light text-gray-600">{subtitle}</div>
      </div>
      <div className="flex flex-row items-center gap-4">
        <input
          type={type}
          id={id}
          disabled={disabled}
          {...register(id, { required })}
          placeholder={placeholder}
          className={`
          peer
          w-full
          p-4
          pt-6 
          font-light 
          bg-white 
          border-2
          rounded-md
          outline-none
          transition
          disabled:opacity-70
          disabled:cursor-not-allowed
          ${errors[id] ? 'border-rose-500' : 'border-neutral-300'}
          ${errors[id] ? 'focus:border-rose-500' : 'focus:border-black'}
        `}
          value={formatValue(value)}
          onChange={onInputChange}
        />
      </div>
    </div>
  );
};

export default NumberInput;
