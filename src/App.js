import "./sass/style.scss"
import 'bootstrap/dist/css/bootstrap.css';
import { RouterProvider, Link, createBrowserRouter } from "react-router-dom";
import Home from './Home';
import Boocking from './boocking';

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home/>,
    },
    {
      path: "boocking/:id/:name/:vicinity/:rating",
      element: <Boocking/>,
    },

  ],
  {
    future: {
      v7_startTransition: true,
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
