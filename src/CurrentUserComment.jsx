import React, { useEffect } from "react";
import data from "./data.json";

const CurrentUserComment = ({
  userData,
  setUserData,
  userVotes,
  setUserVotes,
  replyTarget,
  setReplyTarget,
  replyText,
  setReplyText,
  editingComment,
  setEditingComment,
  editText,
  setEditText,
}) => {
  let currentUserData = userData.currentUser;

  useEffect(() => {
    console.log("From current user");
    console.log(replyText);
  });

  // const handleReplySubmit = (
  //   parent = false,
  //   commentId = null,
  //   userCommName = ""
  // ) => {
  //   if (!replyText.trim()) return;

  //   const newReply = {
  //     id: crypto.randomUUID(),
  //     content: replyText,
  //     createdAt: "Just now",
  //     score: 0,
  //     replyingTo: userCommName,
  //     user: userData.currentUser,
  //     replies: [],
  //   };

  //   const updatedComments = userData.comments.map((comment) => {
  //     // Replying directly to a top-level comment
  //     if (!parent && comment.id === commentId) {
  //       return {
  //         ...comment,
  //         replies: [...comment.replies, newReply],
  //       };
  //     }

  //     // Replying to a reply (nested)
  //     if (parent) {
  //       const updatedReplies = comment.replies.map((reply) => {
  //         if (reply.id === commentId) {
  //           return reply; // not modifying the original reply itself
  //         }
  //         return reply;
  //       });

  //       const isTargetReplyPresent = comment.replies.find(
  //         (reply) => reply.id === commentId
  //       );

  //       if (isTargetReplyPresent) {
  //         return {
  //           ...comment,
  //           replies: [...comment.replies, newReply],
  //         };
  //       }
  //     }

  //     return comment;
  //   });

  //   setUserData({ ...userData, comments: updatedComments });
  //   setReplyText("");
  //   setReplyTarget(null);
  // };

  const handleNewComment = () => {
    if (!replyText.trim()) return;

    const newComment = {
      id: crypto.randomUUID(),
      content: replyText,
      createAt: "Just now",
      score: 0,
      user: userData.currentUser,
      replies: [],
    };

    setUserData({ ...userData, comments: [...userData.comments, newComment] });

    setReplyText("");
  };

  return (
    <div className="bg-white h-[10vh] xl:h-[20vh] w-full xl:w-[60vw] mt-11 flex gap-4 justify-around p-6">
      <div className="">
        <img src={currentUserData.image.png} className="h-[36px]" alt="" />
      </div>
      <div className="">
        <textarea
          name=""
          id=""
          onChange={(e) => {
            setReplyText(e.target.value);
          }}
          value={replyText}
          placeholder="Add a comment"
          className="w-[50vw] xl:w-[40vw] p-2 outline-1 rounded-[1vh] resize-none outline-gray-300 text-gray-500 h-full"
        />
      </div>
      <button
        onClick={() => {
          handleNewComment();
        }}
        className="bg-blue-900 rounded-[1vh] text-white px-4 py-2 font-bold h-fit"
      >
        SEND
      </button>
    </div>
  );
};

export default CurrentUserComment;
