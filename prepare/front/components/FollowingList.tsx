import { List, Button, Avatar } from 'antd';
import { useDispatch } from 'react-redux';
import { UNFOLLOW_REQUEST } from '@reducers/user';
import { useCallback, VFC } from 'react';
import { followInterface } from '@interfaces/storeInterface';

// import head from "next/head";
// import { useMemo } from "react";
// const style_List = useMemo(
//   () => ({ margin: "10px 0", textAlign: "center" }),
//   []
// );

const FollowingList: VFC<{
  header: string;
  data: followInterface[];
}> = ({ header, data }) => {
  const dispatch = useDispatch();
  const onCencel = useCallback(
    (id: number) => () => {
      dispatch({ type: UNFOLLOW_REQUEST, data: id });
    },
    [dispatch],
  );

  return (
    <List
      style={{ marginBottom: 20 }}
      size="small"
      // grid={{ gutter: 4, xs: 1, md: 1 }}
      header={<div>{header}</div>}
      // loadMore={
      //   <div style={{ textAlign: 'center', margin: '10px 0' }}>
      //     <Button>Loading More</Button>
      //   </div>
      // }
      bordered
      dataSource={data}
      renderItem={(item) => (
        <List.Item
          style={{ marginTop: 10 }}
          actions={[
            <Button key="Unfollow" block danger onClick={onCencel(item.id)}>
              Unfollow
            </Button>,
          ]}
        >
          <List.Item.Meta
            avatar={<Avatar>{item.nickname ? item.nickname[0] : 'X'}</Avatar>} // 아직 프로필사진 기능 없음
            title={<a href="https://ant.design">{item.nickname}</a>}
            // description={item.nickname}
          />
        </List.Item>
      )}
    />
  );
};

// FollowingList.propTypes = {
//   header: PropTypes.string.isRequired,
//   data: PropTypes.arrayOf(PropTypes.object).isRequired,
// };
export default FollowingList;
