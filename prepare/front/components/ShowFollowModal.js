import React, { useState, useEffect, useCallback } from "react";
import { Modal, List, Avatar } from "antd";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";

const ShowFollowModal = ({
  id,
  showFollowModal,
  setShowFollowModal,
  showWhat,
  setShowWhat,
}) => {
  const [follows, setFollows] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreFollows = useCallback(() => {
    return axios
      .get(
        `/user/${id}/${showWhat}?lastFollowId=${
          follows[follows.length - 1]?.id || 0
        }&lastAt=${Date.parse(follows[follows.length - 1]?.createdAt) || 0}`
      )
      .then((res) => {
        setHasMore(res.data.length === 10);
        setFollows([...follows, ...res.data]);
      })
      .catch((err) => console.error(err));
  }, [follows]);

  useEffect(() => {
    loadMoreFollows();
  }, []);

  return (
    <>
      <Modal
        title={showWhat}
        visible={showFollowModal}
        onCancel={() => {
          setShowWhat(" ");
          setShowFollowModal(false);
          return null;
        }}
      >
        <InfiniteScroll
          dataLength={follows.length}
          next={loadMoreFollows}
          hasMore={hasMore}
          scrollableTarget="scrollableFollow"
        >
          <List
            id="scrollableFollow"
            style={{ height: "45vh", overflow: "auto" }}
            dataSource={follows}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <a key="list-loadmore-edit">edit</a>,
                  <a key="list-loadmore-more">more</a>,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar>{item?.nickname[0]}</Avatar>}
                  title={<a href="https://ant.design">{item?.nickname}</a>}
                />
              </List.Item>
            )}
          />
        </InfiniteScroll>
      </Modal>
    </>
  );
};

ShowFollowModal.defaultProps = {
  showWhat: " ",
};
ShowFollowModal.propTypes = {
  id: PropTypes.number.isRequired,
  showFollowModal: PropTypes.bool.isRequired,
  setShowFollowModal: PropTypes.func.isRequired,
  setShowWhat: PropTypes.func.isRequired,
  showWhat: PropTypes.string,
};

export default ShowFollowModal;
