import TimePicker from 'react-time-picker';

// rest of the imports...
import {
  DateRange,
  Range,
  RangeKeyDict
} from 'react-date-range';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

interface DatePickerProps {
  dateValue: Range,
  timeValue: string,
  onDateChange: (value: RangeKeyDict) => void,
  onTimeChange: (value: string | null) => void,  // Here's the change
  disabledDates?: Date[],
}

const DatePicker: React.FC<DatePickerProps> = ({
  dateValue,
  timeValue,
  onDateChange,
  onTimeChange,
  disabledDates
}) => {
  return ( 
    <>
      <DateRange
        rangeColors={['#262626']}
        ranges={[dateValue]}
        date={new Date()}
        onChange={onDateChange}
        direction="vertical"
        showDateDisplay={false}
        minDate={new Date()}
        disabledDates={disabledDates}
      />
      <TimePicker
        onChange={onTimeChange}
        value={timeValue}
      />
    </>
  );
}

export default DatePicker;
