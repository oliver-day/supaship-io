import { createContext } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { SupashipUserInfo, useSession } from "./use-session";
import { AllPosts } from "./AllPosts";
import { PostView } from "./Post";
import MessageBoard from "./MessageBoard";
import NavBar from "./NavBar";
import { Welcome, welcomeLoader } from "./Welcome";
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
        loader: welcomeLoader,
      },
    ],
  }
]);

export const UserContext = createContext<SupashipUserInfo>({
  profile: null,
  session: null,
});

function App() {
  return <RouterProvider router={router} />;
}

function Layout() {
  const supashipUserInfo = useSession();
  return (
    <>
      <UserContext.Provider value={supashipUserInfo}>
        <NavBar />
        <Outlet />
      </UserContext.Provider>
    </>
  );
}

export default App;
