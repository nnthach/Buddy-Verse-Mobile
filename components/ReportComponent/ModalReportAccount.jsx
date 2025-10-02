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

function ModalReportAccount({
  openReportAccount,
  setOpenReportAccount,
  reportAccountForm,
  setReportAccountForm,
  handleSubmitReport,
}) {
  const { userId } = useContext(AuthContext);

  const visible = !!openReportAccount;

  const handleClose = () => {
    setOpenReportAccount(null);
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
        <View className="flex-1 justify-center items-center bg-beige-primary/30">
          {/* Content */}
          <View className="bg-white w-[300px] rounded-2xl p-6">
            <Text className="text-lg font-medium text-center mb-4 text-purple-primary">
              Tố cáo người dùng
            </Text>

            <TextInput
              className="border border-gray-400 rounded-2xl h-28 p-2"
              placeholder="Nhập lý do..."
              placeholderTextColor="#718EBF50"
              keyboardType="default"
              multiline
              textAlignVertical="top"
              value={reportAccountForm.reason}
              onChangeText={(text) =>
                setReportAccountForm((prev) => ({
                  ...prev,
                  reason: text,
                }))
              }
            />

            <TouchableOpacity
              onPress={handleSubmitReport}
              className="bg-purple-primary p-2 w-full rounded-full mt-4"
            >
              <Text className="text-beige-primary text-center text-lg font-mediums">
                Gửi
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

export default memo(ModalReportAccount);
