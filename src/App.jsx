import { React, useState } from "react";
import UsersComment from "./UsersComment";
import CurrentUserComment from "./CurrentUserComment";
import data from "./data.json";

const App = () => {
  const [userData, setUserData] = useState(data);
  const [userVotes, setUserVotes] = useState({});
  const [replyTarget, setReplyTarget] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");

  return (
    <div className="bg-[#f5f6fa] min-h-screen max-w-screen p-0">
      <div className="_container_ py-[1vh] xl:py-[5vh] h-auto max-w-screen flex justify-center justify-self-center flex-col">
        <UsersComment
          userData={userData}
          setUserData={setUserData}
          userVotes={userVotes}
          setUserVotes={setUserVotes}
          replyTarget={replyTarget}
          setReplyTarget={setReplyTarget}
          replyText={replyText}
          setReplyText={setReplyText}
          editingComment={editingComment}
          setEditingComment={setEditingComment}
          editText={editText}
          setEditText={setEditText}
        />
        <CurrentUserComment
          userData={userData}
          setUserData={setUserData}
          userVotes={userVotes}
          setUserVotes={setUserVotes}
          replyTarget={replyTarget}
          setReplyTarget={setReplyTarget}
          replyText={replyText}
          setReplyText={setReplyText}
          editingComment={editingComment}
          setEditingComment={setEditingComment}
          editText={editText}
          setEditText={setEditText}
        />
      </div>
    </div>
  );
};

export default App;
