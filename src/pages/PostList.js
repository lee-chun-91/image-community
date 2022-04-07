// PostList.js
import React from "react";

import Post from "../components/Post";
import { useDispatch, useSelector } from "react-redux";

import { actionCreators as postActions } from "../redux/modules/post";

const PostList = (props) => {
  const dispatch = useDispatch();
  const post_list = useSelector((state) => state.post.list);
  //store 에서 user_info 가져오기
  const user_info = useSelector((state) => state.user.user);
  // console.log(user_info);

  React.useEffect(() => {
    if (post_list.length === 0) {
      dispatch(postActions.getPostFB());
    }
  }, []);

  return (
    <React.Fragment>
      {post_list.map((p, idx) => {
        // 유저가 로그인 했고, 유저 uid 랑 post 의 user_id 가 같을 떄에는 수정 버튼 출력위해 is_me props 넘겨줌
        if (user_info && p.user_info.user_id === user_info.uid) {
          return <Post key={p.id} {...p} is_me />;
        }
        return <Post key={p.id} {...p} />;
      })}
    </React.Fragment>
  );
};

export default PostList;
