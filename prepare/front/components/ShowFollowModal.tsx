import { useState, useEffect, useCallback, VFC } from 'react';
import { Modal, List, Avatar } from 'antd';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';

interface ShowFollowModalProps {
  id: number;
  showFollowModal: boolean;
  setShowFollowModal: (prop: boolean) => void;
  setShowWhat: (e: any) => void;
  showWhat?: string;
}

const ShowFollowModal: VFC<ShowFollowModalProps> = ({
  id,
  showFollowModal,
  setShowFollowModal,
  showWhat = '',
  setShowWhat,
}) => {
  const [follows, setFollows] = useState<
    { id: number; nickname: string; createdAt: string }[]
  >([]);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreFollows = useCallback(() => {
    return axios
      .get<{ id: number; nickname: string; createdAt: string }[]>(
        `/user/${id}/${showWhat}?lastFollowId=${
          follows[follows.length - 1]?.id || 0
        }&lastAt=${Date.parse(follows[follows.length - 1]?.createdAt) || 0}`,
      )
      .then((res) => {
        setHasMore(res.data.length === 10);
        setFollows([...follows, ...res.data]);
      })
      .catch((err) => console.error(err));
  }, [follows, id, showWhat]);

  useEffect(() => {
    loadMoreFollows();
  }, [loadMoreFollows]);

  return (
    <Modal
      title={showWhat}
      visible={showFollowModal}
      onCancel={() => {
        setFollows([]);
        setShowWhat(' ');
        setShowFollowModal(false);
        return null;
      }}
    >
      <InfiniteScroll
        dataLength={follows.length}
        next={loadMoreFollows}
        hasMore={hasMore}
        scrollableTarget="scrollableFollow"
        loader
      >
        <List
          id="scrollableFollow"
          style={{ height: '45vh', overflow: 'auto' }}
          dataSource={follows}
          renderItem={(item) => (
            <List.Item
              actions={[<p key="edit">edit</p>, <p key="more">more</p>]}
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
  );
};

ShowFollowModal.defaultProps = {
  showWhat: ' ',
};
ShowFollowModal.propTypes = {
  id: PropTypes.number.isRequired,
  showFollowModal: PropTypes.bool.isRequired,
  setShowFollowModal: PropTypes.func.isRequired,
  setShowWhat: PropTypes.func.isRequired,
  showWhat: PropTypes.string,
};

export default ShowFollowModal;
