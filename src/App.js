import { Route, Routes } from "react-router-dom";
import GlobalStyling from "./styles/global";
import AuthRoutes from "./components/AuthRoutes";
import Navbar from "./components/Navbar";
import HomePage from "./views/Home";
import Dashboard from "./views/Dashboard";
import AlbumsSection from "./views/AlbumsPage";
import AlbumDetails from "./views/AlbumDetails";
import SignIn from "./views/SignIn";
import CreateAccount from "./views/CreateAccount";
import AuthContextProvider from "./contexts/AuthContext";

function App() {
  return (
    <>
      <div className="App">
        <GlobalStyling />
        <AuthContextProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/create-account" element={<CreateAccount />} />
            <Route path="/albums/:albumId" element={<AlbumDetails />} />

            {/*Protected routes */}
            <Route
              path="/dashboard"
              element={
                <AuthRoutes redirectTo="/sign-in">
                  <Dashboard />
                </AuthRoutes>
              }
            />
            <Route
              path="/albums"
              element={
                <AuthRoutes redirectTo="/sign-in">
                  <AlbumsSection />
                </AuthRoutes>
              }
            />
          </Routes>
        </AuthContextProvider>
      </div>
    </>
  );
}

export default App;
