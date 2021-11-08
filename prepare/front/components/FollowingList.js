import React from "react";
import { List, Button, Avatar, Skeleton } from "antd";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { UNFOLLOW_REQUEST } from "../reducers/user";

// import head from "next/head";
// import { useMemo } from "react";
// const style_List = useMemo(
//   () => ({ margin: "10px 0", textAlign: "center" }),
//   []
// );
const FollowingList = ({ header, data }) => {
  const dispatch = useDispatch();
  const onCencel = (id) => () => {
    dispatch({ type: UNFOLLOW_REQUEST, data: id });
  };

  return (
    <>
      <List
        style={{ marginBottom: 20 }}
        size="small"
        // grid={{ gutter: 4, xs: 1, md: 1 }}
        header={<div>{header}</div>}
        loadMore={
          <div style={{ textAlign: "center", margin: "10px 0" }}>
            <Button>Loading More</Button>
          </div>
        }
        bordered
        dataSource={data}
        renderItem={(item) => (
          <List.Item
            style={{ marginTop: 10 }}
            actions={[
              <Button block type="danger" onClick={onCencel(item.id)}>
                Unfollow
              </Button>,
            ]}
          >
            <Skeleton avatar title={false} loading={item.loading} active>
              <List.Item.Meta
                avatar={<Avatar>{item.nickname[0]}</Avatar>} // 아직 프로필사진 기능 없음
                title={<a href="https://ant.design">{item.nickname}</a>}
                // description={item.nickname}
              />
            </Skeleton>
          </List.Item>
        )}
      />
    </>
  );
};

FollowingList.propTypes = {
  header: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};
export default FollowingList;
