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

function CommentModal({ setPostId, postId }) {
  const { userId } = useContext(AuthContext);
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

  const CommentItem = ({ comment, onReply, userId }) => {
    return (
      <View
        style={{
          marginVertical: 8,
        }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between">
          {/* Left */}
          <View className="flex-row items-center gap-2">
            <Image
              source={{ uri: comment?.account?.photoUrls[0] }}
              className="w-9 h-9 rounded-full bg-gray-300"
            />
            <Text className="font-semibold text-lg text-black">
              {comment?.account?.username || "unknown"}
            </Text>
            <Text className="text-gray-500 text-xs">{comment?.timeAgo}</Text>
          </View>

          {/* Right */}
          <View className="relative">
            {comment?.account?.accountId === userId && (
              <Ionicons name="ellipsis-vertical" size={18} color="black" />
            )}
          </View>
        </View>

        {/* Content */}
        <Text className="text-black mt-1 w-[90%]">
          {comment?.content || "content"}
        </Text>
        {/*Reply comment */}
        <TouchableOpacity onPress={() => onReply(comment)}>
          <Text className="mt-2 text-gray-500 text-sm">Trả lời</Text>
        </TouchableOpacity>

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <View className="mt-4" style={{ paddingLeft: 12 }}>
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.commentId}
                comment={reply}
                onReply={onReply}
                userId={userId}
              />
            ))}
          </View>
        )}
      </View>
    );
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
          className="h-[70%] bg-white-primary rounded-t-2xl p-4"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
        >
          {/* Header */}
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-bold text-black">Bình luận</Text>
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
            <View className={`${Platform.OS === "ios" ? "pb-6" : "pb-3"}`}>
              {replyPeople && (
                <View className="mb-2 bg-gray-100 rounded-lg p-2 flex-row justify-between items-center">
                  <Text>Đang trả lời @{replyPeople}</Text>
                  <TouchableOpacity onPress={() => handleCancelReplyComment()}>
                    <Ionicons name="close" size={20} color="black" />
                  </TouchableOpacity>
                </View>
              )}
              <View className="flex-row items-center gap-3 pt-2">
                <TextInput
                  className="border border-gray-300 rounded-lg px-3 py-2 flex-1 text-base text-black"
                  placeholder="Nhập bình luận..."
                  value={commentDataForm.content}
                  onChangeText={(text) =>
                    setCommentDataForm((prev) => ({ ...prev, content: text }))
                  }
                />
                <TouchableOpacity onPress={() => handleCreateComment()}>
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

// <View key={comment.commentId} className="mb-4 relative">
//   {/* Header */}
//   <View className="flex-row items-center justify-between">
//     {/* Left */}
//     <View className="flex-row items-center gap-2">
//       <Text className="font-semibold text-lg text-black">
//         {comment?.account?.username || "unknown"}
//       </Text>
//       <Text className="text-gray-500 text-xs">
//         {comment?.timeAgo}
//       </Text>
//     </View>

//     {/* Right */}
//     <View className="relative">
//       {comment?.account?.accountId === userId && (
//         <Ionicons
//           name="ellipsis-vertical"
//           size={18}
//           color="black"
//         />
//       )}
//     </View>
//   </View>

//   {/* Content */}
//   <Text className="text-black mt-1">
//     {comment?.content || "content"}
//   </Text>
//   {/*Reply comment */}
//   <TouchableOpacity onPress={() => handleReplyComment(comment)}>
//     <Text className="mt-2 text-gray-500 text-sm">Trả lời</Text>
//   </TouchableOpacity>
//   {comment?.replies &&
//     comment?.replies.map((item) => (
//       // reply item
//       <View key={item.commentId} className="ml-2 mt-1">
//         {/* Header */}
//         <View className="flex-row items-center justify-between">
//           {/* Left */}
//           <View className="flex-row items-center gap-2">
//             <Text className="font-semibold text-lg text-black">
//               {item?.account?.username || "unknown"}
//             </Text>
//             <Text className="text-gray-500 text-xs">
//               {item?.timeAgo}
//             </Text>
//           </View>

//           {/* Right */}
//           <View className="relative">
//             {item?.account?.accountId === userId && (
//               <Ionicons
//                 name="ellipsis-vertical"
//                 size={18}
//                 color="black"
//               />
//             )}
//           </View>
//         </View>

//         {/* Content */}
//         <Text className="text-black mt-1">
//           {item?.content || "content"}
//         </Text>
//         {/*Reply comment */}
//         <TouchableOpacity
//           onPress={() => handleReplyComment(item)}
//         >
//           <Text className="mt-2 text-gray-500 text-sm">
//             Trả lời
//           </Text>
//         </TouchableOpacity>
//       </View>
//     ))}
// </View>
