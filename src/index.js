import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./shared/App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";

import store from "./redux/configureStore";

ReactDOM.render(
  // 9. 로그인 하기(4) - 스토어 주입하기
  // 19) 리덕스와 컴포넌트 연결하기
  // (1) index.js 에서 스토어 주입하기
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
