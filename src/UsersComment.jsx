import React, { useEffect, useState } from "react";
import data from "./data.json";
import profilePic from "../public/images/avatars/image-amyrobson.png";
import replyPic from "../public/images/icon-reply.svg";
import deletePic from "../public/images/icon-delete.svg";
import editPic from "../public/images/icon-edit.svg";

const UsersComment = ({
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
  // const [userVotes, setUserVotes] = useState({});
  // const [replyTarget, setReplyTarget] = useState(null);
  // const [replyText, setReplyText] = useState("");
  // const [editingComment, setEditingComment] = useState(null);
  // const [editText, setEditText] = useState("");

  let currentUserYou = userData.currentUser;
  let comments = userData.comments;

  useEffect(() => {
    // console.log(replyTarget);
  }, [replyTarget]);

  const reply = (parent = false, commentId = null, userCommName = "") => {
    setReplyTarget({
      id: commentId,
      isReply: parent,
      usernameOfCmt: userCommName,
    });
  };

  const handleLike = (
    itemId,
    item,
    likeType,
    likeNo,
    userName,
    parent = false
  ) => {
    if (userName === "juliusomo") return;
    const votekey = `${parent ? "comment" : "reply"}-${itemId}`;
    const previousVote = userVotes[votekey];

    if (previousVote === likeType) return;
    const updatedData = {
      ...userData,
      comments: userData.comments.map((comment) => {
        if (!parent && comment.id === itemId) {
          return {
            ...comment,
            score:
              likeType === "plus"
                ? comment.score + (previousVote ? 2 : 1)
                : comment.score - (previousVote ? 2 : 1),
          };
        }

        if (parent) {
          const updatedReplies = comment.replies.map((reply) => {
            if (reply.id === itemId) {
              return {
                ...reply,
                score:
                  likeType === "plus"
                    ? reply.score + (previousVote ? 2 : 1)
                    : reply.score - (previousVote ? 2 : 1),
              };
            }
            return reply;
          });
          return {
            ...comment,
            replies: updatedReplies,
          };
        }
        return comment;
      }),
    };
    setUserData(updatedData);
    setUserVotes({ ...userVotes, [votekey]: likeType });
    console.log(userVotes);
  };

  const handleReplySubmit = () => {
    if (!replyText.trim()) return;

    const newReply = {
      id: crypto.randomUUID(),
      content: replyText,
      createdAt: "Just now",
      score: 0,
      replyingTo: "",
      user: userData.currentUser,
      replies: [],
    };
    // console.log(replyTarget.usernameOfCmt);

    const updatedComments = userData.comments.map((comment) => {
      if (!replyTarget.isReply && replyTarget.id === comment.id) {
        newReply.replyingTo = comment.user.username;
        return {
          ...comment,
          replies: [...comment.replies, newReply],
        };
      }
      if (replyTarget.isReply) {
        const updatedReplies = comment.replies.map((reply) => {
          if (reply.id === replyTarget.id) {
            newReply.replyingTo = reply.user.username;
          }
          return reply;
        });

        if (newReply.replyingTo) {
          return {
            ...comment,
            replies: [...comment.replies, newReply],
          };
        }
      }
      return comment;
    });
    setUserData({ ...userData, comments: updatedComments });
    setReplyText("");
    setReplyTarget(null);
  };

  const deleteComment = (id, isReply = false, parentId = null) => {
    const updatedComments = isReply
      ? userData.comments.map((comment) => {
          if (comment.id === parentId) {
            const filteredReplies = comment.replies.filter(
              (reply) => reply.id !== id
            );
            return {
              ...comment,
              replies: filteredReplies,
            };
          }
          return comment;
        })
      : userData.comments.filter((comment) => comment.id !== id);

    setUserData({ ...userData, comments: updatedComments });
  };

  const handleEdit = (
    commentId,
    isReply,
    comment = null,
    item = null,
    e = null
  ) => {
    if (!isReply) {
      setEditingComment({
        id: commentId,
        isReply: isReply,
      });
      setEditText(comment.content);
    } else if (isReply) {
      console.log(item);
      setEditingComment({
        id: commentId,
        isReply: isReply,
      });
      setEditText(item.content);
    }
  };

  const handleEditSubmit = () => {
    if (editText.trim() === "") return;

    const editedComment = userData.comments.map((comment) => {
      if (!editingComment.isReply && comment.id === editingComment.id) {
        return {
          ...comment,
          content: editText,
        };
      }

      if (editingComment.isReply) {
        const updatedEditedReplies = comment.replies.map((reply) => {
          if (reply.id === editingComment.id) {
            return {
              ...reply,
              content: editText,
            };
          }
          return reply;
        });

        return {
          ...comment,
          replies: updatedEditedReplies,
        };
      }
      return comment;
    });

    setUserData({ ...userData, comments: editedComment });
    setEditingComment(null);
    setEditText("");
  };

  return (
    <div className="max-w-[90vw] xl:max-w-[60vw]">
      {comments
        ? comments.map((comment) => (
            <div className="LvlOneComCont" key={comment.id}>
              <div className="_levelOneComment_ bg-white w-[90vw] xl:w-[60vw] p-[3vh] flex h-fit rounded-[1vh] mt-[3vh] pb-[4.5vh] xl:my-[3vh]">
                <div className="_likes_ bg-[#f5f6fa] hidden xl:flex flex-col h-fit items-center w-fit rounded-[2vh] p-[.5vw] text-gray-400 font-bold">
                  <div
                    onClick={() =>
                      handleLike(
                        comment.id,
                        comment,
                        "plus",
                        comment.score,
                        comment.user.username
                      )
                    }
                    className="_increase_ cursor-pointer"
                  >
                    +
                  </div>
                  <div className="_number_ text-blue-900">{comment.score}</div>
                  <div
                    onClick={() =>
                      handleLike(
                        comment.id,
                        comment,
                        "minus",
                        comment.score,
                        comment.user.username
                      )
                    }
                    className="_decrease_ cursor-pointer"
                  >
                    -
                  </div>
                </div>
                <div className="_commentContent_ flex flex-col xl:ml-[4vh] h-fit w-full">
                  <div className="_userDetail_&_replyIcon flex gap-[1vw] items-start relative">
                    <img
                      src={`${comment?.user?.image?.png}`}
                      className="h-[31px] mr-2 xl:h-[41px]"
                      alt=""
                    />
                    <div className="_commenterName_ text-blue-950 font-bold">
                      {comment?.user?.username}
                    </div>
                    <div
                      className={`_ifUser_ ${
                        comment?.user?.username === "juliusomo"
                          ? "block"
                          : "hidden"
                      } bg-purple-900 px-2.5 py-0.5 flex items-center rounded-[1vh] text-white`}
                    >
                      you
                    </div>
                    <div className="_timeOfComment_ text-gray-500 font-medium">
                      {comment.createdAt}
                    </div>
                    <div
                      onClick={() =>
                        reply(false, comment.id, comment.user.username)
                      }
                      className={`${
                        comment?.user?.username !== "juliusomo"
                          ? "hidden xl:flex"
                          : "xl:hidden"
                      } _reply_ gap-2 absolute right-0 cursor-pointer`}
                    >
                      <img
                        src={replyPic}
                        className="h-[14px] mt-[8px]"
                        alt=""
                      />
                      <div className="text-blue-900 font-bold">Reply</div>
                    </div>
                    <div
                      className={`${
                        comment?.user?.username === "juliusomo"
                          ? "hidden xl:flex"
                          : "hidden"
                      } _delete&edit_ flex items-center  gap-2.5 absolute right-0`}
                    >
                      <div
                        onClick={() => deleteComment(comment.id, false)}
                        className=" text-blue-900 flex font-bold"
                      >
                        <img
                          src={deletePic}
                          className="h-[16px] self-center mr-2"
                          alt=""
                        />
                        <span className="!text-red-700">Delete</span>
                      </div>
                      <div
                        onClick={(e) => {
                          handleEdit(comment.id, false, comment, null, e);
                        }}
                        className=" text-blue-900 flex font-bold"
                      >
                        <img
                          src={editPic}
                          className="h-[16px] self-center mr-2"
                          alt=""
                        />
                        <span>Edit</span>
                      </div>
                    </div>
                  </div>
                  <div className="_commentText_ pr-[.4rem] xl:pr-[3rem] text-gray-400">
                    {editingComment?.id === comment.id &&
                    !editingComment?.isReply ? (
                      <>
                        <textarea
                          className="w-full p-2 outline-1 outline-gray-300 rounded"
                          value={editText}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              // alert("🔥");
                              handleEditSubmit();
                            }
                          }}
                          onChange={(e) => {
                            setEditText(e.target.value);
                          }}
                        />
                        <button
                          onClick={() => {
                            handleEditSubmit();
                          }}
                          className="bg-blue-900 text-white px-2 py-1 rounded-[1vh] font-medium"
                        >
                          SAVE
                        </button>
                      </>
                    ) : (
                      <>
                        {comment.replyingTo && (
                          <span className="text-blue-900 font-bold">
                            @{comment.replyingTo}
                            {console.log(comment.replyingTo)}
                          </span>
                        )}
                        {comment.content}
                      </>
                    )}
                  </div>
                  {/*vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv Mobile Reply and Edit vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv*/}
                  {/*vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv Mobile Reply and Edit vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv*/}
                  {/*vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv Mobile Reply and Edit vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv*/}
                  {/*vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv Mobile Reply and Edit vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv*/}
                  <div className="_Comment4Mobile_ relative">
                    {/*////////////////////////////////////////////// Reply //////////////////////////////////////////////*/}
                    {/*////////////////////////////////////////////// Reply //////////////////////////////////////////////*/}
                    {/*////////////////////////////////////////////// Reply //////////////////////////////////////////////*/}
                    {/*////////////////////////////////////////////// Reply //////////////////////////////////////////////*/}
                    {/*////////////////////////////////////////////// Reply //////////////////////////////////////////////*/}
                    {/*////////////////////////////////////////////// Reply //////////////////////////////////////////////*/}

                    <div
                      onClick={() =>
                        reply(false, comment.id, comment.user.username)
                      }
                      className={`${
                        comment?.user?.username !== "juliusomo"
                          ? "flex xl:hidden"
                          : "hidden"
                      } _reply_ gap-2 mt-1 right-0 absolute cursor-pointer`}
                    >
                      <img
                        src={replyPic}
                        className="h-[14px] mt-[8px]"
                        alt=""
                      />
                      <div className="text-blue-900 font-bold">Reply</div>
                    </div>
                    {/*////////////////////////////////////////////// Edit and Delete //////////////////////////////////////////////*/}
                    {/*////////////////////////////////////////////// Edit and Delete //////////////////////////////////////////////*/}
                    {/*////////////////////////////////////////////// Edit and Delete //////////////////////////////////////////////*/}
                    {/*////////////////////////////////////////////// Edit and Delete //////////////////////////////////////////////*/}
                    {/*////////////////////////////////////////////// Edit and Delete //////////////////////////////////////////////*/}

                    <div
                      className={`${
                        comment?.user?.username === "juliusomo"
                          ? "flex xl:hidden"
                          : "hidden"
                      } _delete&edit_ flex items-center  gap-2.5 absolute right-0`}
                    >
                      <div
                        onClick={() => deleteComment(comment.id, false)}
                        className=" text-blue-900 flex font-bold"
                      >
                        <img
                          src={deletePic}
                          className="h-[16px] self-center mr-2"
                          alt=""
                        />
                        <span className="!text-red-700">Delete</span>
                      </div>
                      <div
                        onClick={(e) => {
                          handleEdit(comment.id, false, comment, null, e);
                        }}
                        className=" text-blue-900 flex font-bold"
                      >
                        <img
                          src={editPic}
                          className="h-[16px] self-center mr-2"
                          alt=""
                        />
                        <span>Edit</span>
                      </div>
                    </div>
                  </div>
                  {/*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Mobile Reply and Edit ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/}
                  {/*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Mobile Reply and Edit ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/}
                  {/*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Mobile Reply and Edit ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/}
                  {/*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Mobile Reply and Edit ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/}
                </div>
              </div>
              {replyTarget?.id === comment.id && !replyTarget?.isReply && (
                <div className="bg-white h-[20vh] w-[55vw] justify-self-end rounded-[2vh] mt-2 flex gap-4 justify-around p-6">
                  <div className="">
                    <img
                      // src={currentUserData.image.png}
                      src={userData?.currentUser?.image?.png}
                      className="h-[31px] xl:h-[41px]"
                      alt=""
                    />
                  </div>
                  <div className="">
                    <textarea
                      name=""
                      id=""
                      placeholder="Add a comment"
                      onChange={(e) => {
                        // console.log(e.target.value);
                        setReplyText(e.target.value);
                      }}
                      className="w-[40vw] p-2 outline-1 rounded-[1vh] resize-none outline-gray-300 text-gray-400 h-full"
                    />
                  </div>
                  <button
                    onClick={() => handleReplySubmit()}
                    className="bg-blue-900 rounded-[1vh] text-white px-4 py-2 font-bold h-fit"
                  >
                    REPLY
                  </button>
                </div>
              )}
              {comment?.replies?.length > 0
                ? comment?.replies.map((item) => (
                    <div key={item.id}>
                      <div
                        className="lvlTwoCont w-[86vw] xl:w-[57vw] justify-self-end [border-left:_2px_solid_#c7c7c7] py-3 "
                        key={item.id}
                      >
                        <div className="lvlTwoComCont bg-white w-[83vw] xl:w-[55vw] flex justify-self-end p-[3vh] h-fit rounded-[1vh] mt-[3vh]">
                          <div className="_likes_ bg-[#f5f6fa] hidden xl:flex flex-col items-center w-fit h-fit rounded-[2vh] p-[.5vw] text-gray-400 font-bold">
                            <div
                              onClick={() =>
                                handleLike(
                                  item.id,
                                  item,
                                  "plus",
                                  item.score,
                                  item.user.username,
                                  true
                                )
                              }
                              className="_increase_ cursor-pointer"
                            >
                              +
                            </div>
                            <div className="_number_ text-blue-900">
                              {item.score}
                            </div>
                            <div
                              onClick={() =>
                                handleLike(
                                  item.id,
                                  item,
                                  "minus",
                                  item.score,
                                  item.user.username,
                                  true
                                )
                              }
                              className="_decrease_ cursor-pointer"
                            >
                              -
                            </div>
                          </div>
                          <div className="_commentContent_ flex flex-col xl:ml-[4vh] h-fit w-full pb-[2vh] xl:pb-0">
                            <div className="_userDetail_&_replyIcon flex gap-[1vw] items-start relative">
                              <img
                                src={`${item.user.image.png}`}
                                className="h-[31px] mr-2 xl:h-[41px]"
                                alt=""
                              />
                              <div className="_commenterName_ text-blue-950 font-bold">
                                {item.user.username}
                              </div>
                              <div
                                className={`_ifUser_ ${
                                  item.user.username === "juliusomo"
                                    ? "block"
                                    : "hidden"
                                } bg-purple-900 px-2.5 py-0.5 flex items-center rounded-[1vh] text-white`}
                              >
                                you
                              </div>
                              <div className="_timeOfComment_ text-gray-500 font-medium">
                                {item.createdAt}
                              </div>
                              <div
                                onClick={() =>
                                  reply(true, item.id, item.user.username)
                                }
                                className={`${
                                  item.user.username !== "juliusomo"
                                    ? "hidden xl:flex"
                                    : "hidden"
                                } _reply_ gap-2 absolute cursor-pointer right-0`}
                              >
                                <img
                                  src={replyPic}
                                  className="h-[14px] mt-[8px]"
                                  alt=""
                                />
                                <div className="text-blue-900 font-bold">
                                  Reply
                                </div>
                              </div>
                              <div
                                className={`${
                                  item.user.username === "juliusomo"
                                    ? "hidden xl:flex"
                                    : "hidden"
                                } _delete&edit_ flex items-center  gap-2.5 absolute right-0`}
                              >
                                <div
                                  onClick={() =>
                                    deleteComment(item.id, true, comment.id)
                                  }
                                  className=" text-blue-900 flex font-bold"
                                >
                                  <img
                                    src={deletePic}
                                    className="h-[16px] self-center mr-2"
                                    alt=""
                                  />
                                  <span className="text-red-400">Delete</span>
                                </div>
                                <div
                                  onClick={(e) => {
                                    handleEdit(item.id, true, null, item, e);
                                  }}
                                  className=" text-blue-900 flex font-bold"
                                >
                                  <img
                                    src={editPic}
                                    className="h-[16px] self-center mr-2"
                                    alt=""
                                  />
                                  <span>Edit</span>
                                </div>
                              </div>
                            </div>
                            <div className="_commentText_ pr-[.4rem] xl:pr-[3rem] text-gray-400">
                              {editingComment?.id === item.id &&
                              editingComment?.isReply ? (
                                <>
                                  <textarea
                                    value={editText}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        e.preventDefault();
                                        // alert("🔥");
                                        handleEditSubmit();
                                      }
                                    }}
                                    onChange={(e) => {
                                      setEditText(e.target.value);
                                    }}
                                    className="w-full p-2 resize-none outline-1 outline-gray-300"
                                  />
                                  <button
                                    onClick={() => {
                                      handleEditSubmit();
                                    }}
                                    className="bg-blue-900 text-white px-2 py-1 rounded-[1vh] font-medium"
                                  >
                                    SAVE
                                  </button>
                                </>
                              ) : (
                                <>
                                  <span className="text-blue-800 font-bold">
                                    @{item.replyingTo}{" "}
                                  </span>
                                  {item.content}
                                </>
                              )}
                            </div>
                            {/* vvvvvvvvvvvvvvvvvvvvvvvvReplyEdit&mobilevvvvvvvvvvvvvvvvvvvvvvvvvvv */}
                            {/* vvvvvvvvvvvvvvvvvvvvvvvvReplyEdit&mobilevvvvvvvvvvvvvvvvvvvvvvvvvvv */}
                            {/* vvvvvvvvvvvvvvvvvvvvvvvvReplyEdit&mobilevvvvvvvvvvvvvvvvvvvvvvvvvvv */}
                            {/* vvvvvvvvvvvvvvvvvvvvvvvvReplyEdit&mobilevvvvvvvvvvvvvvvvvvvvvvvvvvv */}
                            <div className="_ReplyEdit&mobile_ relative mt-4">
                              {/* ////////////////////////////////////////// Reply */}
                              {/* ////////////////////////////////////////// Reply */}
                              {/* ////////////////////////////////////////// Reply */}
                              {/* ////////////////////////////////////////// Reply */}
                              <div
                                onClick={() =>
                                  reply(true, item.id, item.user.username)
                                }
                                className={`${
                                  item.user.username !== "juliusomo"
                                    ? "flex xl:hidden"
                                    : "hidden"
                                } _reply_ gap-2 absolute cursor-pointer right-0`}
                              >
                                <img
                                  src={replyPic}
                                  className="h-[14px] mt-[8px]"
                                  alt=""
                                />
                                <div className="text-blue-900 font-bold">
                                  Reply
                                </div>
                              </div>
                              {/* ///////////////////////////////////////////// delteEdit */}
                              {/* ///////////////////////////////////////////// delteEdit */}
                              {/* ///////////////////////////////////////////// delteEdit */}
                              {/* ///////////////////////////////////////////// delteEdit */}
                              {/* ///////////////////////////////////////////// delteEdit */}
                              <div
                                className={`${
                                  item.user.username === "juliusomo"
                                    ? "flex xl:hidden"
                                    : "hidden"
                                } _delete&edit_ flex items-center  gap-2.5 absolute right-0`}
                              >
                                <div
                                  onClick={() =>
                                    deleteComment(item.id, true, comment.id)
                                  }
                                  className=" text-blue-900 flex font-bold"
                                >
                                  <img
                                    src={deletePic}
                                    className="h-[16px] self-center mr-2"
                                    alt=""
                                  />
                                  <span className="text-red-400">Delete</span>
                                </div>
                                <div
                                  onClick={(e) => {
                                    handleEdit(item.id, true, null, item, e);
                                  }}
                                  className=" text-blue-900 flex font-bold"
                                >
                                  <img
                                    src={editPic}
                                    className="h-[16px] self-center mr-2"
                                    alt=""
                                  />
                                  <span>Edit</span>
                                </div>
                              </div>
                            </div>
                            {/* ^^^^^^^^^^^^^^^^^^^^^^^^ReplyEdit&mobile^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */}
                            {/* ^^^^^^^^^^^^^^^^^^^^^^^^ReplyEdit&mobile^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */}
                            {/* ^^^^^^^^^^^^^^^^^^^^^^^^ReplyEdit&mobile^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */}
                            {/* ^^^^^^^^^^^^^^^^^^^^^^^^ReplyEdit&mobile^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */}
                          </div>
                        </div>
                      </div>
                      {replyTarget?.id === item.id && replyTarget?.isReply && (
                        <>
                          <div className="bg-white h-[20vh] w-[55vw] justify-self-end rounded-[2vh] mt-2 flex gap-4 justify-around p-6">
                            <div className="">
                              <img
                                src={userData?.currentUser?.image?.png}
                                // src={currentUserData.image.png}
                                className="h-[31px] xl:h-[41px]"
                                alt=""
                              />
                            </div>
                            <div className="">
                              <textarea
                                name=""
                                id=""
                                placeholder="Add a comment"
                                className="w-[40vw] p-2 outline-1 rounded-[1vh] resize-none outline-gray-300 h-full"
                                onChange={(e) => {
                                  setReplyText(e.target.value);
                                }}
                              />
                            </div>
                            <button
                              type="submit"
                              onClick={() => handleReplySubmit()}
                              className="bg-blue-900 rounded-[1vh] text-white px-4 py-2 font-bold h-fit"
                            >
                              REPLY
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                : ""}
            </div>
          ))
        : console.log("did not work")}
    </div>
  );
};

export default UsersComment;
