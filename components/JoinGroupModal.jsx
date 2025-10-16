import {
  View,
  Text,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import { ChatGroupContext } from "@context/ChatGroupContext";
import { AuthContext } from "@context/AuthContext";
import React, { useContext } from "react";
import { joinGroupAPI } from "@services/matchService";
import Toast from "react-native-toast-message";

export default function JoinGroupModal() {
  const { setGroupRoomId, groupRoomId } = useContext(ChatGroupContext);
  const { userId } = useContext(AuthContext);

  const handleJoinGroup = async () => {
    try {
      const res = await joinGroupAPI({
        roomId: groupRoomId,
        accountId: userId,
      });
      console.log("join gr res", res.data);
      Toast.show({
        type: "success",
        text1: "Tham gia nhóm thành công",
        text2: "Cám ơn bạn",
      });
      setGroupRoomId(null);
    } catch (error) {
      console.log("join gr err", error);
    }
  };
  return (
    <Modal
      visible={!!groupRoomId}
      transparent
      animationType="fade"
      onRequestClose={() => setGroupRoomId(null)}
    >
      <TouchableWithoutFeedback onPress={() => setGroupRoomId(null)}>
        {/*overlay */}
        <View className="flex-1 justify-start items-center">
          {/*Content */}

          <View className="w-[85%] rounded-2xl bg-white-primary border border-gray-200 shadow-lg p-6">
            <Text className="text-gray-600 mb-5">
              Bạn có chắc muốn tham gia nhóm này không?
            </Text>
            <View className="flex-row justify-end gap-3">
              <TouchableOpacity
                className="px-4 py-2 rounded-xl bg-gray-200"
                onPress={() => setGroupRoomId(null)}
              >
                <Text className="text-gray-700 font-medium">Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="px-4 py-2 rounded-xl bg-yellow-primary"
                onPress={() => handleJoinGroup()}
              >
                <Text className="text-white-primary font-medium">Tham gia</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
