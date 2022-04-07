import React from "react";

import { Grid, Image, Text, Button } from "../elements";
// history 쓰고 싶은 경우 configStore 에서 임포트
import { history } from "../redux/configureStore";
import { useDispatch } from "react-redux";
import { actionCreators as postActions } from "../redux/modules/post";

const Post = (props) => {
  // PostList 컴포넌트에서 Post 에 {...p} 을 props 로 넘겨줌. 그래서 각 post 들의 정보가 딸려옴
  // console.log(props);

  const { layout } = props;

  const dispatch = useDispatch();

  const deletePost = () => {
    window.alert("삭제가 완료되었습니다");
    dispatch(postActions.deletePostFB(props.id));
  };

  return (
    <React.Fragment>
      <Grid>
        <Grid is_flex padding="16px">
          <Grid is_flex width="auto">
            <Image shape="circle" src={props.src} />
            <Text bold>{props.user_info.user_name}</Text>
          </Grid>
          <Grid is_flex width="auto">
            {/* is_me 를 props 로 가져오는 경우, 버튼 추가 */}
            {props.is_me && (
              <Button
                width="auto"
                padding="4px"
                margin="4px"
                _onClick={() => {
                  history.push(`/write/${props.id}`);
                }}
              >
                수정
              </Button>
            )}
            {props.is_me && (
              <Button
                width="auto"
                padding="4px"
                margin="4px"
                _onClick={deletePost}
              >
                삭제
              </Button>
            )}
            <Text>{props.insert_dt}</Text>
          </Grid>
        </Grid>

        {props.layout === "right" && (
          <Grid>
            <Grid is_flex>
              <Text width="50%" margin="10px" center>
                {props.contents}
              </Text>
              <Image half shape="rectangle" src={props.image_url} />
            </Grid>
            <Grid padding="16px">
              <Text margin="0px" bold>
                댓글 {props.comment_cnt}개
              </Text>
            </Grid>
          </Grid>
        )}

        {props.layout === "left" && (
          <Grid>
            <Grid is_flex>
              <Image half shape="rectangle" src={props.image_url} />
              <Text width="50%" margin="10px" center>
                {props.contents}
              </Text>
            </Grid>
            <Grid padding="16px">
              <Text margin="0px" bold>
                댓글 {props.comment_cnt}개
              </Text>
            </Grid>
          </Grid>
        )}

        {props.layout === "bottom" && (
          <Grid>
            <Grid>
              <Grid>
                <Text margin="10px"> {props.contents}</Text>
              </Grid>
              <Image half shape="rectangle" src={props.image_url} />
            </Grid>
            <Grid padding="16px">
              <Text margin="0px" bold>
                댓글 {props.comment_cnt}개
              </Text>
            </Grid>
          </Grid>
        )}

        {/* <Grid padding="16px">
          <Text>{props.contents}</Text>
        </Grid>
        <Grid>
          <Image shape="rectangle" src={props.image_url} />
        </Grid>
        <Grid padding="16px">
          <Text margin="0px" bold>
            댓글 {props.comment_cnt}개
          </Text>
        </Grid> */}
      </Grid>
    </React.Fragment>
  );
};

Post.defaultProps = {
  user_info: {
    user_name: "chun",
    user_profile:
      "https://www.newsworks.co.kr/news/photo/202002/433057_327801_345.jpg",
  },
  image_url:
    "https://imagecommunity.s3.ap-northeast-2.amazonaws.com/photo_2022-03-15_19-20-40.jpg",
  contents: "프로필!",
  comment_cnt: 10,
  insert_dt: "2022-04-01 10:00:00",
  is_me: false,
};

export default Post;
