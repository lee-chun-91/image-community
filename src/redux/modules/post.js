import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import { firestore, storage } from "../../shared/firebase";
import moment from "moment";

import { actionCreators as imageActions } from "./image";

// actions
const SET_POST = "SET_POST";
const ADD_POST = "ADD_POST";
const EDIT_POST = "UPDATE_POST";
const DELETE_POST = "DELETE_POST";

// action creator
const setPost = createAction(SET_POST, (post_list) => ({ post_list }));
const addPost = createAction(ADD_POST, (post) => ({ post }));
const editPost = createAction(EDIT_POST, (post_id, post) => ({
  post_id,
  post,
}));
const deletePost = createAction(DELETE_POST, (post_id) => ({ post_id }));

// initial State

const initialState = {
  list: [],
};

const initialPost = {
  // id: 0,
  // user_info: {
  //   user_name: "chun",
  //   user_profile:
  //     "https://imagecommunity.s3.ap-northeast-2.amazonaws.com/photo_2022-03-15_19-20-40.jpg",
  // },
  image_url:
    "https://imagecommunity.s3.ap-northeast-2.amazonaws.com/photo_2022-03-15_19-20-40.jpg",
  contents: "",
  comment_cnt: 0,
  layout: "bottom",
  insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
};

// Post 불러오기 미들웨어
const getPostFB = () => {
  return function (dispatch, getState, { history }) {
    //firestore 에 있는 데이터베이스에 접근
    const postDB = firestore.collection("post");

    // 콜랙션 내에 있는 모든 문서 가져오기
    postDB.get().then((docs) => {
      // post 를 담을 빈 배열 post_list 선언
      let post_list = [];
      docs.forEach((doc) => {
        let _post = doc.data();
        // console.log(_post);

        // key들을 값으로 가진 배열을 만들고
        // console.log(Object.keys(_post));
        // reduce를 사용하여 리덕스 state의 모양과 데이터를 맞춰준다.
        let post = Object.keys(_post).reduce(
          (acc, cur) => {
            // indexOf() String 인스턴스에서 특정 문자나 문자열이 처음 등장하는 위치 반환
            // 특정 문자를 찾을 수 없을 때는 -1 반환
            if (cur.indexOf("user_") !== -1) {
              return {
                ...acc,
                user_info: { ...acc.user_info, [cur]: _post[cur] },
              };
            }

            // [cur] 은 key, _post[cur]은 value
            return { ...acc, [cur]: _post[cur] };
          },
          { id: doc.id, user_info: {} }
        );
        // 만들어진 post 를 post_list 에 푸쉬
        post_list.push(post);
      });
      // console.log(post_list);

      // post_list를 인자로 setPost dispatch
      dispatch(setPost(post_list));
    });
  };
};

// addPostFB 미들웨어
// (질문) 처음에 인자로 contents = "", layout = "bottom" 를 입력하면 이게 어떻게 동작되는건지
const addPostFB = (contents = "", layout = "bottom") => {
  return function (dispatch, getState, { history }) {
    const postDB = firestore.collection("post");

    //store 에 있는 user 정보 가져오기
    const _user = getState().user.user;

    const user_info = {
      user_name: _user.user_name,
      user_id: _user.uid,
      user_profile: _user.user_profile,
    };
    const _post = {
      ...initialPost,
      layout,
      contents: contents,
      insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
    };

    //store 에 있는 image 정보 가져오기
    const _image = getState().image.preview;
    console.log(_image);

    // Cloud Storage에 파일을 업로드하려면 우선 파일 이름을 포함하여 파일의 전체 경로를 가리키는 참조를 만듭니다.
    // 파일의 이름은 user_id 와 현재 시간을 밀리초로 나타낸 값을 결합하여 만들었습니다.
    // 문자열에서 업로드를 위해 putString() 을 사용합니다.
    const _upload = storage
      .ref(`images/${user_info.user_id}_${new Date().getTime}`)
      .putString(_image, "data_url");

    _upload.then((snapshot) => {
      snapshot.ref
        .getDownloadURL()
        .then((url) => {
          console.log(url);
          return url;
        })
        //위에서 받은 url을 가지고 드디어.. post 에 url을 넣는다.
        .then((url) => {
          postDB
            .add({ ...user_info, ..._post, image_url: url })
            .then((doc) => {
              let post = { user_info, ..._post, id: doc.id, image_url: url };
              //리덕스에 넣을 때 모양새 맞춰서 넣어줘야 함
              dispatch(addPost(post));
              history.replace("/");
              // 업로드가 잘 끝났으면, postWrite 페이지에 미리보기 상태도 다시 null 로 바꿔줘야!
              dispatch(imageActions.setPreview(null));
            })
            .catch((err) => {
              window.alert("앗! 포스트 작성에 문제가 있어요!");
              console.log("post 작성에 실패했어요!", err);
            });
        })
        .catch((err) => {
          window.alert("앗! 이미지 업로드에 문제가 있어요!");
          console.log("앗. 이미지 업로드에 문제가 있어요!", err);
        });
    });
  };
};

// Post 수정하기 미들웨어
// (질문) 처음에 인자로  (post_id = null, post = {}) 를 입력하는 이유
const editPostFB = (post_id = null, post = {}) => {
  return function (dispatch, getState, { history }) {
    if (!post_id) {
      console.log("게시물 정보가 없어요!");
      return;
    }

    // state에서 image.preview 값 가져오기
    const _image = getState().image.preview;
    console.log(_image);

    //state에서 포스트 아이디 값으로 수정할 포스트 찾기
    const _post_idx = getState().post.list.findIndex((p) => p.id === post_id);
    const _post = getState().post.list[_post_idx];
    console.log(_post);

    //firestore 에 있는 데이터베이스에 접근
    const postDB = firestore.collection("post");

    // 만약 프리뷰 값이랑 포스트 이미지값이 같다면,
    // 해당 문서를 찾아서
    // update(post) 해주고 *이게 뭔지 모르겠다...
    // 그 결과에서

    console.log(postDB.doc(post_id));

    if (_image === _post.image_url) {
      postDB
        .doc(post_id)
        .update(post)
        .then((doc) => {
          dispatch(editPost(post_id, { ...post }));
          history.replace("/");
          dispatch(imageActions.setPreview(null));
        });

      return;
    } else {
      const user_id = getState().user.user.uid;
      const _upload = storage
        .ref(`images/${user_id}_${new Date().getTime()}`)
        .putString(_image, "data_url");

      _upload.then((snapshot) => {
        snapshot.ref
          .getDownloadURL()
          .then((url) => {
            console.log(url);
            return url;
          })
          .then((url) => {
            postDB
              .doc(post_id)
              .update({ ...post, image_url: url })
              .then((doc) => {
                dispatch(editPost(post_id, { ...post, image_url: url }));
                history.replace("/");
                dispatch(imageActions.setPreview(null));
              });
          })
          .catch((err) => {
            window.alert("앗! 이미지 업로드에 문제가 있어요!");
            console.log("앗! 이미지 업로드에 문제가 있어요!", err);
          });
      });
    }
  };
};

// deletePostFB 미들웨어
const deletePostFB = (post_id) => {
  return function (dispatch, getState, { history }) {
    const post_db = firestore.collection("post");

    post_db
      .doc(post_id)
      .delete()
      .then(() => {
        history.replace("/");
        dispatch(deletePost(post_id));
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

// reducer
export default handleActions(
  {
    [SET_POST]: (state, action) =>
      produce(state, (draft) => {
        // 리스트 갈아 끼우기
        draft.list = action.payload.post_list;
      }),
    [ADD_POST]: (state, action) =>
      produce(state, (draft) => {
        //새로운 포스트를 배열의 맨 앞에 붙이기 위해 unshift() 사용
        draft.list.unshift(action.payload.post);
      }),
    [EDIT_POST]: (state, action) =>
      produce(state, (draft) => {
        //수정할 포스트 인덱스 찾고
        let idx = draft.list.findIndex((p) => p.id === action.payload.post_id);
        //찾은 인덱스로 수정할 포스트 불러온 다음, 거기에 새로운 포스트 정보 넣어주기
        draft.list[idx] = { ...draft.list[idx], ...action.payload.post };
      }),
    [DELETE_POST]: (state, action) =>
      produce(state, (draft) => {
        //filter() 를 사용하여 삭제하려고 하는 post_id와 다른 id 값을 가진 아이들만 필터해서 새로운 배열로 담는다.
        draft.list = draft.list.filter((p) => p.id !== action.payload.post_id);
      }),
  },
  initialState
);

//// action creator export
const actionCreators = {
  setPost,
  addPost,
  getPostFB,
  addPostFB,
  editPostFB,
  deletePostFB,
};

export { actionCreators };
