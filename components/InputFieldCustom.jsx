import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const InputField = ({
  type = "text",
  keyboardType,
  label,
  secureTextEntry,
  openSelect,
  setOpenSelect,
  isLoading,
  data,
  setUserProfile,
  userProfile,
  name,
  value,
  ...props
}) => {
  return (
    <View className="gap-1">
      <Text className="text-purple-primary text-xl">{label}</Text>
      {type == "text" ? (
        <View className="bg-white h-14 rounded-xl border border-blue-50">
          <TextInput
            className="h-full w-full px-4 pb-1 text-xl text-black "
            placeholderTextColor="#718EBF50"
            keyboardType={keyboardType || "default"}
            secureTextEntry={secureTextEntry}
            value={value}
            onChangeText={(text) =>
              setUserProfile((prev) => ({
                ...prev,
                [name]: text,
              }))
            }
            {...props}
          />
        </View>
      ) : (
        <>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={setOpenSelect}
            className="relative"
            disabled={isLoading}
          >
            <View className="z-0 bg-white h-14 px-2 rounded-xl border border-blue-50 flex-row w-full justify-between items-center">
              <Text>{value ? value : `Select ${label}`}</Text>
              <MaterialIcons
                name="keyboard-arrow-down"
                size={26}
                color="#57298D"
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
                      setUserProfile((prev) => ({
                        ...prev,
                        [name]: item.label,
                      }));
                      setOpenSelect(false);
                    }}
                    key={index}
                    className="bg-white p-4"
                  >
                    <Text>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </>
      )}
    </View>
  );
};

export default InputField;
