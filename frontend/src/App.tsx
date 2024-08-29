import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { useAuthContext } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

function App() {
  const { authUser, isLoading } = useAuthContext();

  if (isLoading) return null; // shows nothing in the homepage if the value is true i.e page is loading
  // console.log("Auth User: ", authUser);
  return (
    <div className="p-4 h-screen flex items-center justify-center ">
      <Routes>
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUp /> : <Navigate to={"/"} />}
        />
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to={"/"} />}
        />
      </Routes>
      <Toaster/>
    </div>
  );
}

export default App;
