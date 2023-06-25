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
  const onInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const inputValue = parseInt(event.target.value);
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
          type="number"
          className="font-light text-xl text-neutral-600"
          value={value}
          onChange={onInputChange}
        />
      </div>
    </div>
  );
};

export default NumberInput;
