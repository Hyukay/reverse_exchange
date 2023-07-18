import { useCallback, ChangeEvent } from "react";

interface NumberInputProps {
  title: string;
  subtitle: string;
  value: number;
  suffix?: string;
  onChange: (value: number) => void;
}

const NumberInput: React.FC<NumberInputProps> = ({
  title,
  subtitle,
  value,
  onChange,
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
        <div className="font-medium">{title}</div>
        <div className="font-light text-gray-600">{subtitle}</div>
      </div>
      <div className="flex flex-row items-center gap-4">
        <input
          type="text"
          className="font-light text-xl text-neutral-600"
          value={formatValue(value)}
          onChange={onInputChange}
        />
      </div>
    </div>
  );
};

export default NumberInput;
