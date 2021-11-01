import { Avatar, Button, Input, Modal } from "antd";
import { useState } from "react";
import useInput from "../hooks/useInput";
import ReactDOM from "react-dom";
const CommentModal = ({ item, me, isModalVisible, setIsModalVisible }) => {
  const [onEditComment, setOnEditComment] = useState(false);
  const [commentText, onChangeCommentText] = useInput(item.content);
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  return ReactDOM.render(
    <Modal
      title={
        me?.id === item.User.id ? (
          <div>{`내 댓글`}</div>
        ) : (
          <div>
            <Avatar>{item.User.nickname[0]}</Avatar>
            {` ${item.User.nickname[0]} 님의 댓글`}
          </div>
        )
      }
      maskClosable={true}
      visible={isModalVisible}
      onCancel={handleCancel}
      onOk={handleCancel}
      destroyOnClose={true}
      footer={
        <>
          <Button>asd</Button>
          <Button>asd</Button>
          <Button>asd</Button>
        </>
      }
    >
      {console.log(me, item.User)}
      {onEditComment ? (
        <Input.TextArea
          autoSize={{ minRows: 4, maxRows: 10 }}
          style={{ borderRadius: "10px" }}
          className="commentInputArea"
          value={commentText}
          onChange={onChangeCommentText}
          rows={4}
        />
      ) : (
        commentText
      )}
    </Modal>,
    document.getElementById("modalDiv")
  );
};
export default CommentModal;
