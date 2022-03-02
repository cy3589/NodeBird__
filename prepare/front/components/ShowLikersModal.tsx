import { useState, useEffect, useCallback } from 'react';
import { Modal, List, Avatar } from 'antd';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';

const ShowLikersModal = ({
  postId,
  showLikersModal,
  setShowLikersModal,
}: {
  postId: number;
  showLikersModal: boolean;
  setShowLikersModal: (prop: boolean) => void;
}) => {
  const [likers, setLikers] = useState<
    Array<{ id: number; createdAt: string; nickname: string }>
  >([]);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreLikers = useCallback(async () => {
    try {
      const { data } = await axios.get<Array<any>>(
        `/post/${postId}/likers?lastLikerId=${
          likers[likers.length - 1]?.id || 0
        }&lastAt=${Date.parse(likers[likers.length - 1]?.createdAt) || 0}`,
      );
      setHasMore(data.length === 10);
      setLikers((prev) => [...prev, ...data]);
    } catch (error) {
      if (axios.isAxiosError(error)) console.error();
    }
  }, [likers, postId]);
  useEffect(() => {
    loadMoreLikers();
  }, []);

  return (
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
        loader
      >
        <List
          id="scrollableDiv"
          style={{ height: '45vh', overflow: 'auto' }}
          dataSource={likers}
          renderItem={(item) => (
            <List.Item
              actions={[
                <p key="list-loadmore-edit">edit</p>,
                <p key="list-loadmore-more">more</p>,
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
  );
};

ShowLikersModal.propTypes = {
  postId: PropTypes.number.isRequired,
  showLikersModal: PropTypes.bool.isRequired,
  setShowLikersModal: PropTypes.func.isRequired,
};

export default ShowLikersModal;
