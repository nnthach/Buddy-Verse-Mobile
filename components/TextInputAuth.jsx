import { useState } from "react";
import { Text, TextInput, View } from "react-native";

function TextInputAuth({
  focusedField,
  setFocusedField,
  label,
  value,
  onChangeText,
  error,
  customLeftCSSOnblur = "left-4",
  customLeftCSSOnfocus = "left-4",
  name,
  ...props
}) {
  const isFocused = focusedField === name;
  return (
    <>
      <View
        className={`relative border ${error ? "border-red-500" : isFocused ? "border-black" : "border-gray-400"} rounded-xl h-14 `}
      >
        <TextInput
          className={`h-full w-full px-4 pb-1 text-xl text-black`}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocusedField(name)}
          onBlur={() => setFocusedField(null)}
          textAlignVertical="center"
          {...props}
        />
        <Text
          className={`absolute bg-white-primary left-4 
                        transition-all duration-200 ease-in-out ${
                          isFocused || value
                            ? `-top-3 px-1 scale-90 text-black`
                            : `top-1/2 -translate-y-1/2 scale-100 text-gray-400`
                        }`}
        >
          {label}
        </Text>
      </View>

      {error && (
        <Text className="text-red-500 text-sm mt-[-14px]">{error}</Text>
      )}
    </>
  );
}

export default TextInputAuth;
