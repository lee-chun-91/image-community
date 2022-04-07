// 08. 로그인하기(3) - 리덕스 스토어 만들기
// 1) import 필요한 거 하기

import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { createBrowserHistory } from "history";
import { connectRouter } from "connected-react-router";

import User from "./modules/user";
import Post from "./modules/post";
import Image from "./modules/image";

// 7) 스토어에 히스토리 넣어주기
export const history = createBrowserHistory();

// 2) root reducer 만들기
const rootReducer = combineReducers({
  user: User,
  post: Post,
  image: Image,
  router: connectRouter(history),
});

// 3) 미들웨어 준비하기
const middlewares = [thunk.withExtraArgument({ history: history })];

// 지금이 어느 환경인 지 알려줘요. (개발환경, 프로덕션(배포)환경 ...)
const env = process.env.NODE_ENV;

// 개발환경에서는 로거라는 걸 하나만 더 써볼게요.
if (env === "development") {
  const { logger } = require("redux-logger");
  middlewares.push(logger);
}

// 4) 크롬 확장 프로그램 redux devTools 사용 설정하기
const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;

// 5) 미들웨어 묶기
const enhancer = composeEnhancers(applyMiddleware(...middlewares));

// 6) 미들웨어랑 루트리듀서 엮어서 스토어 만들기
let store = (initialStore) => createStore(rootReducer, enhancer);

export default store();
