import { CloseCircleFilled } from "@ant-design/icons";
import { Avatar, Button, Comment, Input, Popover, Space } from "antd";
import { useState, useCallback } from "react";
import useInput from "../hooks/useInput";
const IndividualComment = ({ item, me }) => {
  const [commentEditMode, setCommentEditMode] = useState(false);
  const [comment, onChangeComment, setComment] = useInput(item.content);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const onToggleCommentEditMode = useCallback(() => {
    console.log("popoverVisible:", popoverVisible);
    console.log("onToggleCommentEditMode");
    setPopoverVisible(false);
    setCommentEditMode((prev) => !prev);
  }, [popoverVisible, commentEditMode]);

  return (
    <>
      <li>
        <span>
          <Popover
            visible={!commentEditMode && popoverVisible}
            onVisibleChange={(e) => {
              console.log(e);
              setPopoverVisible(e);
            }}
            overlayInnerStyle={{
              borderRadius: "10px",
            }}
            trigger="click"
            content={
              <div>
                <Space>
                  <Button
                    onClick={onToggleCommentEditMode}
                    style={{ borderRadius: "10px" }}
                    type="primary"
                  >
                    수정
                  </Button>
                  <Button style={{ borderRadius: "10px" }} type="danger">
                    삭제
                  </Button>
                </Space>
              </div>
            }
          >
            <Comment
              style={{
                border: "1px solid #f0f0f0",
                borderRadius: "10px",
                paddingLeft: "10px",
                paddingRight: "7%",
                margin: "10px 0 10px 0",
                backgroundColor: "rgba(255,255,255)",
                width: !commentEditMode && "fit-content",
              }}
              key={item.id}
              author={
                <a
                  href={`/user/${item.UserId}`}
                  css={css`
                    color: black;
                    :hover {
                      color: #1e5878;
                    }
                  `}
                >
                  {item.User.nickname}
                </a>
              }
              avatar={
                <a href={`/user/${item.UserId}`}>
                  <Avatar
                    css={css`
                      transition: 0.2s;
                      :hover {
                        transform: scale(1.2);
                      }
                    `}
                  >
                    {item.User.nickname[0]}
                  </Avatar>
                </a>
              }
              content={
                <>
                  {commentEditMode ? (
                    <div>
                      <Input.TextArea
                        style={{
                          borderRadius: "10px",
                          position: "relative",
                        }}
                        autoSize={{ minRows: 2, maxRows: 10 }}
                        value={comment}
                        onChange={onChangeComment}
                      />
                      <Space
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          float: "right",
                          paddingTop: "13px",
                        }}
                      >
                        <Button
                          block
                          type="primary"
                          ghost
                          style={{ width: "fit-content" }}
                        >
                          저장
                        </Button>
                        <Button
                          block
                          type="danger"
                          ghost
                          icon={<CloseCircleFilled />}
                        ></Button>
                      </Space>
                      ,
                    </div>
                  ) : (
                    <div>{comment}</div>
                  )}
                </>
              }
            />
          </Popover>
        </span>
      </li>
    </>
  );
};

export default IndividualComment;
