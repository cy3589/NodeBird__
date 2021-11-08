import React from "react";
import { List, Button, Skeleton, Avatar, Space } from "antd";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { FOLLOW_REQUEST, BLOCK_USER_REQUEST } from "../reducers/user";

const FollowerList = ({ header, data }) => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const BlockUser = (item) => () => {
    dispatch({
      type: BLOCK_USER_REQUEST,
      data: item.id,
    });
  };
  const onFollowBack = (item) => () => {
    dispatch({
      type: FOLLOW_REQUEST,
      data: item.id,
    });
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
              me.Followings.some((v) => v.id === item.id) ? (
                <>
                  <div style={{ margin: "0 10px 0 10px" }}>
                    <Button block type="danger" onClick={BlockUser(item)}>
                      Block
                    </Button>
                  </div>
                </>
              ) : (
                <div>
                  <Space style={{ marginRight: 10 }}>
                    <Button block type="primary" onClick={onFollowBack(item)}>
                      Follow back
                    </Button>
                    <Button block type="danger">
                      Block
                    </Button>
                  </Space>
                </div>
              ),
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

FollowerList.propTypes = {
  header: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};
export default FollowerList;
