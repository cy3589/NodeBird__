import React, { useState, useEffect, useCallback } from "react";
import { Modal, List, Avatar } from "antd";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";

const ShowLikersModal = ({ postId, showLikersModal, setShowLikersModal }) => {
  const [likers, setLikers] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreLikers = useCallback(() => {
    return axios
      .get(
        `/post/${postId}/likers?lastLikerId=${
          likers[likers.length - 1]?.id || 0
        }&lastAt=${Date.parse(likers[likers.length - 1]?.createdAt) || 0}`
      )
      .then((res) => {
        setHasMore(res.data.length === 10);
        setLikers([...likers, ...res.data]);
      })
      .catch((err) => console.error(err));
  }, [likers]);
  useEffect(() => {
    loadMoreLikers();
  }, []);

  return (
    <>
      <Modal
        title="Like"
        visible={showLikersModal}
        onCancel={() => {
          setShowLikersModal(false);
          return null;
        }}
      >
        <InfiniteScroll
          dataLength={likers.length}
          next={loadMoreLikers}
          hasMore={hasMore}
          scrollableTarget="scrollableDiv"
        >
          <List
            id="scrollableDiv"
            style={{ height: "45vh", overflow: "auto" }}
            dataSource={likers}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <a key="list-loadmore-edit">edit</a>,
                  <a key="list-loadmore-more">more</a>,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar>{item.nickname[0]}</Avatar>}
                  title={<a href="https://ant.design">{item.nickname}</a>}
                />
              </List.Item>
            )}
          />
        </InfiniteScroll>
      </Modal>
    </>
  );
};

ShowLikersModal.propTypes = {
  postId: PropTypes.number.isRequired,
  showLikersModal: PropTypes.bool.isRequired,
  setShowLikersModal: PropTypes.func.isRequired,
};

export default ShowLikersModal;
