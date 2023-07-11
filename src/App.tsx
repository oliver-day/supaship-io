import { useState } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import AllPosts from "./AllPosts";
import PostView from "./PostView";
import MessageBoard from "./MessageBoard";
import NavBar from "./NavBar";
import Welcome from "./Welcome";
import './App.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <MessageBoard />,
        children: [
          {
            path: ":pageNumber",
            element: <AllPosts />,
          },
          {
            path: ":pageNumber/:postId",
            element: <PostView />,
          },
        ],
      },
      {
        path: "welcome",
        element: <Welcome />,
      },
    ],
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

function Layout() {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}

export default App;
