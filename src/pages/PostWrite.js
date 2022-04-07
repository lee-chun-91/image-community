import React from "react";
import { Grid, Text, Button, Image, Input } from "../elements";
import Upload from "../shared/Upload";

import { useSelector, useDispatch } from "react-redux";
import { actionCreators as postActions } from "../redux/modules/post";
import { actionCreators as imageActions } from "../redux/modules/image";

const PostWrite = (props) => {
  const dispatch = useDispatch();
  const is_login = useSelector((state) => state.user.is_login);
  const preview = useSelector((state) => state.image.preview);
  const post_list = useSelector((state) => state.post.list);

  // (질문) PostWrite 의 props 는 어디서 받아오는 건지 잘 모르겠음.
  // console.log(props);
  const post_id = props.match.params.id;

  //url에 params.id가 있으면, (post_id) true 출력
  const is_edit = post_id ? true : false;

  // history 가져오기
  // (질문) history 를 왜 props 로 선언해주는지 모르겠음.
  const { history } = props;

  // is_edit 값이 있으면, post_id 값으로 수정을 원하는 게시물 찾음
  let _post = is_edit ? post_list.find((p) => p.id === post_id) : null;
  const [layout, setLayout] = React.useState(_post ? _post.layout : "bottom");

  // 수정하고 싶은 포스트 값이 있으면(수정을 눌러 들어왔으면), post.contents로 contents 초기값 잡음
  const [contents, setContents] = React.useState(_post ? _post.contents : "");

  // 수정 눌러 들어온 화면에서 side effect 한 번 실행해보자.
  React.useEffect(() => {
    // url이 /write/~~ 인데, 해당 id 를 가진 포스트 값이 없다면?
    if (is_edit && !_post) {
      console.log("포스트 정보가 없어요!");
      history.goBack();

      return;
    }

    //
    if (is_edit) {
      dispatch(imageActions.setPreview(_post.image_url));
    }
  }, []);

  const changeContents = (e) => {
    setContents(e.target.value);
  };

  const addPost = () => {
    dispatch(postActions.addPostFB(contents, layout));
  };

  const editPost = () => {
    dispatch(postActions.editPostFB(post_id, { contents: contents, layout }));
  };

  const is_checked = (e) => {
    if (e.target.checked) {
      setLayout(e.target.value);
    }
  };

  if (!is_login) {
    return (
      <Grid margin="100px 0px" padding="16px" center>
        <Text size="32px" bold>
          앗! 잠깐
        </Text>
        <Text size="16px">로그인 후에만 글을 쓸 수 있어요</Text>
        {/* history.replace()는 지금 있는 페이지에서 갈아끼워주는 개념 */}
        <Button
          _onClick={() => {
            history.replace("/");
          }}
        >
          로그인 하러 가기
        </Button>
      </Grid>
    );
  }

  return (
    <React.Fragment>
      <Grid padding="16px">
        <Text margin="0px" size="30px" bold>
          {is_edit ? "게시글 수정" : "게시글 작성"}
        </Text>
        <Upload />
      </Grid>

      <Grid>
        <Grid padding="16px">
          <Text bold size="20px" margin="10px 0">
            레이아웃 고르기
          </Text>
        </Grid>

        <Grid padding="16px">
          <input
            type="radio"
            name="layout"
            value="right"
            id="right"
            onChange={is_checked}
          />
          <label htmlFor="right">
            <strong
              style={
                layout === "right" ? { color: "#136", margin: "10px" } : null
              }
            >
              오른쪽에 이미지 왼쪽에 텍스트
            </strong>
          </label>
        </Grid>
        <Grid is_flex>
          <Text width="50%" margin="10px" center>
            {contents}
          </Text>
          <Image
            half
            shape="rectangle"
            src={
              preview
                ? preview
                : "https://img.bfmtv.com/c/630/420/871/7b9f41477da5f240b24bd67216dd7.jpg"
            }
          />
        </Grid>

        <Grid padding="16px">
          <input
            type="radio"
            name="layout"
            value="left"
            id="right"
            onChange={is_checked}
          />
          <label htmlFor="left">
            <strong
              style={
                layout === "left" ? { color: "#136", margin: "10px" } : null
              }
            >
              왼쪽에 이미지 오른쪽에 텍스트
            </strong>
          </label>
        </Grid>
        <Grid is_flex>
          <Image
            half
            shape="rectangle"
            src={
              preview
                ? preview
                : "https://img.bfmtv.com/c/630/420/871/7b9f41477da5f240b24bd67216dd7.jpg"
            }
          />
          <Text width="50%" margin="10px" center>
            {contents}
          </Text>
        </Grid>

        <Grid padding="16px">
          <input
            type="radio"
            name="layout"
            value="bottom"
            id="right"
            onChange={is_checked}
          />
          <label htmlFor="bottom">
            <strong
              style={
                layout === "bottom" ? { color: "#136", margin: "10px" } : null
              }
            >
              아래에 이미지 위에 텍스트
            </strong>
          </label>
        </Grid>
        <Grid>
          <Grid>
            <Text margin="10px">{contents}</Text>
          </Grid>
          <Image
            half
            shape="rectangle"
            src={
              preview
                ? preview
                : "https://img.bfmtv.com/c/630/420/871/7b9f41477da5f240b24bd67216dd7.jpg"
            }
          />
        </Grid>
      </Grid>

      <Grid padding="16px">
        <Input
          _onChange={changeContents}
          label="게시글 내용"
          placeholder="게시글 작성"
          multiLine
        />
      </Grid>

      <Grid padding="16px">
        {is_edit ? (
          <Button
            text="게시글 수정"
            _onClick={editPost}
            //contents 에 입력된 값이 없다는 걸 어떻게 표현할 수 있을까?
            _disabled={Input === "" && !preview ? true : false}
          ></Button>
        ) : (
          <Button
            text="게시글 작성"
            _onClick={addPost}
            //contents 에 입력된 값이 없다는 걸 어떻게 표현할 수 있을까?
            _disabled={Input === "" && !preview ? true : false}
          ></Button>
        )}
      </Grid>
    </React.Fragment>
  );
};

export default PostWrite;
