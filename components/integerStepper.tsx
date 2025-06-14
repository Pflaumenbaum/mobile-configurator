import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { IconButton, TextInput } from "react-native-paper";

type IntegerStepperProps = {
  min: number;
  max: number;
  initial?: number;
  onChange?: (value: number) => void;
};

const IntegerStepper: React.FC<IntegerStepperProps> = ({
  min,
  max,
  initial = min,
  onChange,
}) => {
  const clamp = (val: number) => Math.max(min, Math.min(max, val));
  const [value, setValue] = useState<number>(clamp(initial));
  const [text, setText] = useState<string>(value.toString());

  const updateValue = (newVal: number) => {
    const clamped = clamp(newVal);
    setValue(clamped);
    setText(clamped.toString());
    onChange?.(clamped);
  };

  const handleTextChange = (input: string) => {
    if (input === "") {
      setText("");
      return;
    }

    const intVal = parseInt(input, 10);
    if (!isNaN(intVal)) {
      updateValue(intVal);
    }
    setText(input);
  };

  const increment = () => updateValue(value + 1);
  const decrement = () => updateValue(value - 1);

  return (
    <View style={styles.container}>
      <IconButton icon="minus" onPress={decrement} disabled={value <= min} />
      <TextInput
        mode="outlined"
        style={styles.input}
        keyboardType="number-pad"
        value={text}
        onChangeText={handleTextChange}
        onBlur={() => {
          updateValue(parseInt(text, 10) || min);
        }}
      />
      <IconButton icon="plus" onPress={increment} disabled={value >= max} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    width: 80,
    textAlign: "center",
  },
});

export default IntegerStepper;
