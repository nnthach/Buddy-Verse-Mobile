import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AuthContext } from "@context/AuthContext";
import { memo, useContext, useEffect, useState } from "react";
import { commentPostAPI, getPostCommentAPI } from "@services/postService";

function CommentModal({ setPostId, postId }) {
  const { userId } = useContext(AuthContext);
  const [commentDataForm, setCommentDataForm] = useState({
    content: "",
    parentCommentId: null,
  });
  const [loading, setLoading] = useState(false);
  const [commentList, setCommentList] = useState(null);

  const handleGetPostComment = async () => {
    setLoading(true);
    try {
      const res = await getPostCommentAPI(postId);
      setCommentList(res.data);
    } catch (error) {
      console.log("get post comment err", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateComment = async () => {
    try {
      const res = await commentPostAPI(postId, commentDataForm, {
        accountId: userId,
      });
      console.log("create comment res", res);
      console.log("create comment res data", res.data);
      setCommentList(res.data);
      setCommentDataForm((prev) => ({
        ...prev,
        content: "",
      }));
      handleGetPostComment();
    } catch (error) {
      console.log("create post comment err", error);
    }
  };

  useEffect(() => {
    handleGetPostComment();
  }, []);

  return (
    <Modal
      visible={!!postId}
      animationType="slide"
      transparent
      onRequestClose={() => {
        setPostId(null);
      }}
    >
      <View className="flex-1 justify-end bg-black/70">
        <KeyboardAvoidingView
          className="h-[70%] bg-white-primary rounded-t-2xl p-4"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
        >
          {/* Header */}
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-bold text-black">Comments</Text>
            <TouchableOpacity onPress={() => setPostId(null)}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {/* Comments list */}
          {loading ? (
            <ActivityIndicator />
          ) : commentList?.length < 1 ? (
            <View className="flex-1 items-center justify-center">
              <Text className="text-gray-500">No comments</Text>
            </View>
          ) : (
            <FlatList
              data={commentList}
              keyExtractor={(item) => item.commentId}
              contentContainerStyle={{ paddingBottom: 20 }}
              renderItem={({ item: comment }) => (
                <View key={comment.commentId} className="mb-4 relative">
                  {/* Header */}
                  <View className="flex-row items-center justify-between">
                    {/* Left */}
                    <View className="flex-row items-center gap-2">
                      <Text className="font-semibold text-lg text-black">
                        {comment?.account?.username || "unknown"}
                      </Text>
                      <Text className="text-gray-500 text-xs">
                        {comment?.createdAt &&
                          new Date(comment.createdAt).toLocaleString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                      </Text>
                    </View>

                    {/* Right */}
                    <View className="relative">
                      {comment?.account?.accountId === userId && (
                        <Ionicons
                          name="ellipsis-vertical"
                          size={18}
                          color="black"
                        />
                      )}
                    </View>
                  </View>

                  {/* Content */}
                  <Text className="text-black mt-1">
                    {comment?.content || "content"}
                  </Text>
                </View>
              )}
            />
          )}

          {/* Input field */}
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View
              className={`flex-row items-center gap-3 pt-2 ${
                Platform.OS === "ios" ? "pb-6" : "pb-3"
              }`}
            >
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2 flex-1 text-sm text-black"
                placeholder="Type here..."
                value={commentDataForm.content}
                onChangeText={(text) =>
                  setCommentDataForm((prev) => ({ ...prev, content: text }))
                }
              />
              <TouchableOpacity onPress={() => handleCreateComment()}>
                <Ionicons name="send" size={22} color="black" />
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

export default memo(CommentModal);
