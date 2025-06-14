import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { TextInput, TouchableRipple } from "react-native-paper";
import {
  DatePickerModal,
  enGB,
  registerTranslation,
  TimePickerModal,
} from "react-native-paper-dates";

type Props = {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
};

export const DateInput = ({ value, onChange, label }: Props) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(
    value ? new Date(value) : new Date(),
  );

  const handleDateConfirm = (params: { date: Date | undefined }) => {
    if (params.date) {
      setTempDate(params.date);
      setShowDatePicker(false);
      setShowTimePicker(true);
    }
  };

  const handleTimeConfirm = ({
    hours,
    minutes,
  }: {
    hours: number;
    minutes: number;
  }) => {
    const finalDate = new Date(
      tempDate.getFullYear(),
      tempDate.getMonth(),
      tempDate.getDate(),
      hours,
      minutes,
    );
    setShowTimePicker(false);
    onChange(finalDate.toISOString());
  };

  const displayValue = value
    ? new Date(value).toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  useEffect(() => {
    registerTranslation("en", enGB);
  }, []);

  return (
    <View style={{ marginVertical: 10 }}>
      <TouchableRipple onPress={() => setShowDatePicker(true)}>
        <View pointerEvents="none">
          <TextInput
            label={label}
            value={displayValue}
            mode="outlined"
            editable={false}
            right={<TextInput.Icon icon="calendar" />}
          />
        </View>
      </TouchableRipple>

      <DatePickerModal
        presentationStyle="pageSheet"
        locale="en"
        mode="single"
        visible={showDatePicker}
        date={tempDate}
        onDismiss={() => setShowDatePicker(false)}
        onConfirm={handleDateConfirm}
      />

      <TimePickerModal
        visible={showTimePicker}
        onDismiss={() => setShowTimePicker(false)}
        onConfirm={handleTimeConfirm}
        hours={tempDate.getHours()}
        minutes={tempDate.getMinutes()}
      />
    </View>
  );
};

export default DateInput;
