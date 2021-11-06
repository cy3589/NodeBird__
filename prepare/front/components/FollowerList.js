import React from "react";
import { List, Button, Card } from "antd";
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
        grid={{ gutter: 4, xs: 2, md: 3 }}
        size="small"
        header={<div>{header}</div>}
        loadMore={
          <div style={{ textAlign: "center", margin: "10px 0" }}>
            <Button>더 보기</Button>
          </div>
        }
        bordered
        dataSource={data}
        renderItem={(item) => (
          <List.Item style={{ marginTop: 20 }}>
            <Card
              actions={[
                me.Followings.some((v) => v.id === item.id) ? (
                  <>
                    <Button block type="danger" onClick={BlockUser(item)}>
                      Block
                    </Button>
                  </>
                ) : (
                  <>
                    <Button block type="primary" onClick={onFollowBack(item)}>
                      Follow back
                    </Button>
                    <Button block type="danger">
                      Block
                    </Button>
                  </>
                ),
              ]}
            >
              <Card.Meta description={item.nickname} />
            </Card>
          </List.Item>
        )}
      />
    </>
  );
};

FollowerList.propTypes = {
  header: PropTypes.string.isRequired,
  data: PropTypes.objectOf(PropTypes.array).isRequired,
};
export default FollowerList;
