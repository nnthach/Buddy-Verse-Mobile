import { memo, useContext, useState } from "react";
import {
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { AuthContext } from "../../context/AuthContext";

function ModalReportMessage({
  messageReportId,
  setMessageReportId,
  reportMessageForm,
  setReportMessageForm,
  handleSubmitReport,
}) {
  const { userId } = useContext(AuthContext);

  const visible = !!messageReportId;

  const handleClose = () => {
    setMessageReportId(null);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        {/* Overlay */}
        <View className="flex-1 justify-center items-center bg-white-primary/50">
          {/* Content */}
          <View className="bg-white-primary w-[300px] p-6 border-[0.5px] border-black rounded-2xl">
            <Text className="text-lg font-medium text-center mb-4">
              Hãy ghi lý do
            </Text>

            <TextInput
              className="border border-gray-400 rounded-2xl h-28 p-2"
              placeholder="Nhập lý do..."
              placeholderTextColor="#718EBF50"
              keyboardType="default"
              multiline
              textAlignVertical="top"
              value={reportMessageForm.reason}
              onChangeText={(text) =>
                setReportMessageForm((prev) => ({
                  ...prev,
                  reason: text,
                }))
              }
            />

            <TouchableOpacity
              onPress={handleSubmitReport}
              className="bg-yellow-primary p-2 w-full rounded-full mt-4"
            >
              <Text className="text-white-primary text-center text-lg font-medium">
                Gửi
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

export default memo(ModalReportMessage);
