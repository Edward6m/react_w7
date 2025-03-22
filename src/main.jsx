import { createRoot } from "react-dom/client";
import store from "./store.js";  // 使用默認導入
import { Provider } from "react-redux";

import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
