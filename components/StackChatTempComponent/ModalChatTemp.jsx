import {
  matchContinueAPI,
  matchDeleteAPI,
  matchEndAPI,
} from "@services/matchService";
import { memo, useContext } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { AuthContext } from "../../context/AuthContext";

function ModalChatTemp({ roomId, setOpenModal, openModal }) {
  const { userId } = useContext(AuthContext);

  const handleEndChat = async () => {
    try {
      console.log("modal room end chat", roomId);
      const res = await matchDeleteAPI(roomId);
      console.log("End chat res", res);
    } catch (err) {
      console.log("End chat API error:", err);
    }
  };

  const handleContinueChat = async () => {
    try {
      const res = await matchContinueAPI({ accountId: userId, roomId });
      console.log("continue chat res", res);
    } catch (err) {
      console.log("continue chat API error:", err);
    }
  };

  const visible = !!openModal;

  const handleClose = () => {
    setOpenModal(false);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      {/* Overlay */}
      <View className="flex-1 justify-center items-center">
        {/* Content */}
        <View className="bg-white w-[300px] rounded-2xl p-6">
          <Text className="text-lg font-medium text-center mb-4">
            Do you want to continue this relationship?
          </Text>

          <View className="flex-row gap-2 justify-between">
            <TouchableOpacity
              onPress={handleEndChat}
              className="w-[50%] justify-center items-center bg-red-500 rounded-xl px-4 py-2"
            >
              <Text className="text-white font-medium">End</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleContinueChat}
              className="w-[50%] justify-center items-center bg-green-500 rounded-xl px-4 py-2"
            >
              <Text className="text-white font-medium">Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default memo(ModalChatTemp);
