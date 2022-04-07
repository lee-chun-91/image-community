import React from "react";
// import { Grid, Image, Text, Button } from "../elements";
import Post from "../components/Post";
import CommentList from "../components/CommentList";
import CommentWrite from "../components/CommentWrite";

// import { history } from "../redux/configureStore";
// import { useDispatch, useSelector } from "react-redux";
// import { actionCreators as postActions } from "../redux/modules/post";
// import Permit from "../shared/Permit";

const PostDetail = (props) => {
  return (
    <React.Fragment>
      <Post />
      <CommentWrite />
      <CommentList />
    </React.Fragment>
  );
};

export default PostDetail;
