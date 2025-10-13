import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const InputField = ({
  type = "text",
  keyboardType,
  label,
  secureTextEntry,
  openSelect,
  setOpenSelect,
  isLoading,
  data,
  setDataForm,
  userProfile,
  name,
  value,
  ...props
}) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  return (
    <View className="gap-1">
      <Text className="text-gray-primary text-xl">{label}</Text>
      {type == "text" && (
        <View className="bg-white-primary h-14 rounded-xl border border-gray-four">
          <TextInput
            className="h-full w-full px-4 pb-2 text-xl text-black "
            placeholderTextColor="#718EBF50"
            keyboardType={keyboardType || "default"}
            secureTextEntry={secureTextEntry}
            value={value}
            onChangeText={(text) =>
              setDataForm((prev) => ({
                ...prev,
                [name]: text,
              }))
            }
            {...props}
          />
        </View>
      )}

      {type == "select" && (
        <>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={setOpenSelect}
            className="relative"
            disabled={isLoading}
          >
            <View
              className="z-0 bg-white-primary
             h-14 px-4 rounded-xl border border-gray-four flex-row w-full justify-between items-center"
            >
              <Text>{value ? value : `Select ${label}`}</Text>
              <MaterialIcons
                name="keyboard-arrow-down"
                size={26}
                color="#6C757D"
              />
            </View>
          </TouchableOpacity>
          {openSelect && data?.length >= 1 && (
            <View className="shadow-custom absolute top-24 z-10 w-full max-h-[250px] rounded-xl border border-gray-400 overflow-hidden">
              <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
              >
                {data?.map((item, index) => (
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                      setDataForm((prev) => ({
                        ...prev,
                        [name]: item.label,
                      }));
                      setOpenSelect(false);
                    }}
                    key={index}
                    className="bg-white-primary p-4"
                  >
                    <Text>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </>
      )}

      {type === "date" && (
        <>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => setDatePickerVisibility(true)}
          >
            <View className="bg-white-primary h-14 px-4 rounded-xl border border-gray-four flex-row w-full justify-between items-center">
              <Text>{value ? value : `Select ${label}`}</Text>
              <MaterialIcons name="calendar-today" size={22} color="#6C757D" />
            </View>
          </TouchableOpacity>

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={(date) => {
              setDatePickerVisibility(false);
              setDataForm((prev) => ({
                ...prev,
                [name]: date.toISOString().split("T")[0], // yyyy-mm-dd
              }));
            }}
            onCancel={() => setDatePickerVisibility(false)}
          />
        </>
      )}
    </View>
  );
};

export default InputField;
