import { RouterProvider } from "react-router-dom";
import Router from "./Routes/Router";
import { AuthProvider } from "./Routes/AuthContext";

function App() {
  const router = Router();
  return (
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    );
}
export default App;


