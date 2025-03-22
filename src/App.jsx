import { createHashRouter, RouterProvider } from "react-router-dom";

import "./assets/all.scss";
import 'bootstrap/dist/js/bootstrap.min.js';
import routes from "./routes";
import Layout from "./Layout";

const router = createHashRouter(routes);

function App() {
  return (
    <>
      <RouterProvider router={router} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Layout />
      </RouterProvider>
    </>
  );
}

export default App;
