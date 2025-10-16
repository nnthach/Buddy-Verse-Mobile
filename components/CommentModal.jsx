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
  Image,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AuthContext } from "@context/AuthContext";
import { memo, useContext, useEffect, useState } from "react";
import { commentPostAPI, getPostCommentAPI } from "@services/postService";

// ReplyList.jsx
const ReplyList = ({ replies, onReply, userId }) => {
  return (
    <>
      <View className="mt-3">
        {replies.map((reply) => (
          <View key={reply.commentId} style={{ marginBottom: 10 }}>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <Image
                  source={{ uri: reply?.account?.photoUrls?.[0] }}
                  className="w-8 h-8 rounded-full bg-gray-300"
                />
                <Text className="font-semibold text-base text-black">
                  {reply?.account?.username || "unknown"}
                </Text>
                <Text className="text-gray-500 text-xs">{reply?.timeAgo}</Text>
              </View>

              {reply?.account?.accountId === userId && (
                <Ionicons name="ellipsis-vertical" size={16} color="black" />
              )}
            </View>

            <Text className="text-black mt-1 w-[90%]">
              {reply?.content || "content"}
            </Text>

            <TouchableOpacity onPress={() => onReply(reply)}>
              <Text className="mt-2 text-gray-500 text-sm">Trả lời</Text>
            </TouchableOpacity>

            {/* Nếu reply này cũng có reply con — vẫn nằm trong cùng khối */}
            {reply.replies && reply.replies.length > 0 && (
              <ReplyList
                replies={reply.replies}
                onReply={onReply}
                userId={userId}
              />
            )}
          </View>
        ))}
      </View>
    </>
  );
};

// CommentItem.jsx
const CommentItem = ({ comment, onReply, userId }) => {
  const [openReply, setOpenReply] = useState(false);

  return (
    <View style={{ marginVertical: 8 }}>
      {/* Header */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Image
            source={{ uri: comment?.account?.photoUrls?.[0] }}
            className="w-9 h-9 rounded-full bg-gray-300"
          />
          <Text className="font-semibold text-lg text-black">
            {comment?.account?.username || "unknown"}
          </Text>
          <Text className="text-gray-500 text-xs">{comment?.timeAgo}</Text>
        </View>

        {comment?.account?.accountId === userId && (
          <Ionicons name="ellipsis-vertical" size={18} color="black" />
        )}
      </View>

      {/* Nội dung */}
      <Text className="text-black mt-1 w-[90%]">
        {comment?.content || "content"}
      </Text>

      {/* Nút trả lời */}
      <TouchableOpacity onPress={() => onReply(comment)}>
        <Text className="mt-2 text-gray-500 text-sm">Trả lời</Text>
      </TouchableOpacity>

      {/* Nếu có replies */}
      {comment.replies && comment.replies.length > 0 && (
        <>
          <TouchableOpacity
            onPress={() => setOpenReply(true)}
            className={`${!openReply ? "" : "hidden"} mt-2 ml-1 flex-row items-center gap-2`}
          >
            <View className="h-[1px] w-[20px] bg-gray-300" />
            <Text className="text-gray-400">Xem thêm câu trả lời khác</Text>
          </TouchableOpacity>
          {/*reply list */}
          <View className={`ml-6 ${openReply ? "" : "hidden"}`}>
            <ReplyList
              replies={comment.replies}
              onReply={onReply}
              userId={userId}
            />
          </View>
          <TouchableOpacity
            onPress={() => setOpenReply(false)}
            className={`${openReply ? "" : "hidden"} mt-[-10px] ml-6 flex-row items-center gap-2`}
          >
            <View className="h-[1px] w-[20px] bg-gray-300" />
            <Text className="text-gray-400">Ẩn câu trả lời</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

// root
function CommentModal({ setPostId, postId }) {
  const { userId, userInfo } = useContext(AuthContext);
  const [commentDataForm, setCommentDataForm] = useState({
    content: "",
    parentCommentId: null,
  });
  const [loading, setLoading] = useState(false);
  const [commentList, setCommentList] = useState(null);
  const [replyPeople, setReplyPeople] = useState(null);

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
      setCommentList(res.data);
      setCommentDataForm({
        content: "",
        parentCommentId: null,
      });
      setReplyPeople(null);
      handleGetPostComment();
    } catch (error) {
      console.log("create post comment err", error);
    }
  };

  const handleReplyComment = (comment) => {
    setCommentDataForm((prev) => ({
      ...prev,
      parentCommentId: comment.commentId,
    }));
    setReplyPeople(comment.account.username);
  };

  const handleCancelReplyComment = () => {
    setCommentDataForm((prev) => ({
      ...prev,
      parentCommentId: null,
    }));
    setReplyPeople(null);
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
      <View className="flex-1 justify-end bg-black/50">
        <KeyboardAvoidingView
          className="h-[70%] rounded-t-2xl pb-0  bg-white-primary"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
        >
          {/* Header */}
          <View className="flex-row justify-center items-center p-3 pt-4 border-b border-gray-100">
            <Text className="text-lg font-bold text-black">Bình luận</Text>
            <TouchableOpacity
              onPress={() => setPostId(null)}
              className="absolute right-3 top-4"
            >
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
              className="px-4"
              renderItem={({ item: comment }) => (
                <CommentItem
                  comment={comment}
                  onReply={handleReplyComment}
                  userId={userId}
                />
              )}
            />
          )}

          {/* Input field */}
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View
              className={`${Platform.OS === "ios" ? "pb-6" : "pb-3"} border-t border-gray-100 pt-3`}
            >
              {replyPeople && (
                <View className="mb-2 bg-gray-100 rounded-lg p-2 flex-row justify-between items-center">
                  <Text>Đang trả lời @{replyPeople}</Text>
                  <TouchableOpacity onPress={() => handleCancelReplyComment()}>
                    <Ionicons name="close" size={20} color="black" />
                  </TouchableOpacity>
                </View>
              )}
              <View className="flex-row items-center gap-3 pt-2 px-4">
                <Image
                  source={{ uri: userInfo?.photos[0] }}
                  className="w-11 h-11 rounded-full bg-gray-200"
                />
                <TextInput
                  className="border border-gray-300 rounded-full px-3 pr-12 py-2 flex-1 text-base text-black"
                  placeholder="Nhập bình luận..."
                  value={commentDataForm.content}
                  onChangeText={(text) =>
                    setCommentDataForm((prev) => ({ ...prev, content: text }))
                  }
                />
                <TouchableOpacity
                  onPress={() => handleCreateComment()}
                  className="absolute right-7 top-4"
                >
                  <Ionicons name="send" size={22} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

export default memo(CommentModal);
