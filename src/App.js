import "./App.css";

// useState is used by React to update the DOM and interface based on changes
// useRef allow us to capture data from user input via the web interface
// useEffect is a hook that allows us to store data persistently
import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

import PageError from "./pages/PageError";

// Layouts
import RootLayout from "./layouts/RootLayout";
import useAuth from "./hooks/useAuth";
import MovieAndShowInfo from "./pages/MovieAndShowInfo";
import MissingMovieAndShowInfo from "./pages/MissingMovieAndShowInfo";
import HDMoviesAndShows from "./pages/HDMoviesAndShows";
import { hdMoviesAndShowsLoader } from "./loaders/hdMoviesAndShowsLoader";
import { sdMoviesAndShowsLoader } from "./loaders/sdMoviesAndShowsLoader";
import { movieAndShowInfoLoader } from "./loaders/movieAndShowInfoLoader";
import { missingFileInfoLoader } from "./loaders/missingFileInfoLoader";
import SDMoviesAndShows from "./pages/SDMoviesAndShows";
import { missingMovieAndShowInfoButtonHandler } from "./pages/MissingMovieAndShowInfo";

/**
 * Build the Component structure via react router v6 structure.
 * @returns
 */
function App() {
  const { auth } = useAuth();
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />} errorElement={<PageError />}>
        <Route
          default
          index
          element={<MovieAndShowInfo />}
          loader={movieAndShowInfoLoader}
        />
        <Route
          path="/missingfileinfo"
          element={<MissingMovieAndShowInfo />}
          loader={missingFileInfoLoader}
          action={missingMovieAndShowInfoButtonHandler}
        />
        <Route
          path="/hdmoviesandshows"
          element={<HDMoviesAndShows />}
          loader={hdMoviesAndShowsLoader}
        />
        <Route
          path="/sdmoviesandshows"
          element={<SDMoviesAndShows />}
          loader={sdMoviesAndShowsLoader}
        />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

/*

        <Route
          index
          element={<InventoryItems />}
          loader={inventoryItemsLoader}
        />
        <Route
          path="/inventoryitems"
          element={<InventoryItems />}
          loader={inventoryItemsLoader}
        />
        <Route
          path="/inventoryitems/:userName"
          element={<InventoryItems />}
          loader={inventoryItemsByUserNameLoader}
          errorElement={<InventoryItemsError />}
        />
        <Route
          path="/inventoryitem/:id"
          element={<InventoryItem />}
          loader={inventoryItemLoader}
          action={inventoryItemButtonHandler}
          errorElement={<InventoryItemsError />}
        />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="logout" element={<Logout />} />
        <Route element={<RequireAuth />}>
          <Route
            path="createinventoryitem"
            element={<CreateInventoryItem />}
            action={createInventoryItemAction({ auth })}
          />
        </Route>
        <Route
          path="*"
          element={<InventoryItems />}
          loader={inventoryItemsLoader}
        />{" "}
        */

export default App;
