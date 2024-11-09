import "./sass/style.scss"
import 'bootstrap/dist/css/bootstrap.css';
import { Route, Routes, BrowserRouter, RouterProvider, Link, createBrowserRouter } from "react-router-dom";
import Home from './Home';
import Boocking from './boocking';

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home/>,
    },
    {
      path: "boocking",
      element: <Boocking/>,
    },

  ],
  {
    future: {
      v7_startTransition: true, // Enable the startTransition future flag
    },
  }
);
  
  return (
    <>
    <RouterProvider router={router} />
    </>
  );
}

export default App;
