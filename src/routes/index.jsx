import Layout from "../Layout";
import Home from "../pages/Home";
// import Products from "../pages/Products";
import Product from "../pages/ProductPage";
// import Cart from "../pages/Cart";
import Page404 from "../pages/Page404";

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: 'admin',
        element: <Product />,

      },
      {
        path: "*",
        element: <Page404 />,
      },
    ],
  },
];

export default routes;
