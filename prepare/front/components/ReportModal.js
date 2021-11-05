import { Avatar, Comment, Input, Modal } from "antd";
import useInput from "../hooks/useInput";

const ReportModal = ({
  ReportWhat,

  reportPostId,
  reportPost,
  reportUserId,
  reportUserNickname,

  reportCommentId,
  reportComment,

  isModalVisible,
  setIsModalVisible,

  userId,
}) => {
  const [reportContent, onChangeReportContent] = useInput("");
  return isModalVisible ? (
    <>
      <Modal
        onOk={() => {
          ReportWhat === "Post"
            ? console.log({
                type: "REPORT_POST_REQUEST",
                data: {
                  reportPostId: reportPostId,
                  reportUserId: reportUserId,
                  reportContent: reportContent,
                },
              })
            : ReportWhat === "Comment" &&
              console.log({
                type: "REPORT_COMMENT_REQUEST",
                data: {
                  reportPostId: reportPostId,
                  reportUserId: reportUserId,
                  reportCommentId: reportCommentId,
                  reportContent: reportContent,
                },
              });
        }}
        okText="신고"
        cancelText="신고 취소"
        visible={isModalVisible}
        maskClosable={true}
        onCancel={() =>
          Modal.confirm({
            title: "취소하시겠어요?",
            content: "지금 취소하면 입력한 내용이 삭제됩니다.",
            okText: "취소하기",
            cancelText: "계속 입력하기",
            maskClosable: true,
            onOk: () => setIsModalVisible(false),
          })
        }
        title={
          ReportWhat === "Post"
            ? `${reportUserNickname}님의 게시글 신고`
            : ReportWhat === "Comment" && `${reportUserNickname}님의 댓글 신고`
        }
      >
        {ReportWhat === "Comment" && (
          <Comment
            style={{
              border: "1px solid #f0f0f0",
              borderRadius: "10px",
              paddingLeft: "10px",
              paddingRight: "7%",
              margin: "10px 0 10px 0",
              backgroundColor: "rgba(255,255,255)",
            }}
            author={reportUserNickname}
            avatar={
              <Avatar
                css={css`
                  transition: 0.2s;
                  :hover {
                    transform: scale(1.2);
                  }
                `}
              >
                {reportUserNickname[0]}
              </Avatar>
            }
            content={
              <>
                <div>{reportComment}</div>
              </>
            }
          />
        )}
        <Input.TextArea
          placeholder="어떤 문제가 발생했나요?"
          style={{
            borderRadius: "10px",
            position: "relative",
          }}
          autoSize={{ minRows: 2, maxRows: 10 }}
          value={reportContent}
          onChange={onChangeReportContent}
        />
      </Modal>
    </>
  ) : null;
};

export default ReportModal;
