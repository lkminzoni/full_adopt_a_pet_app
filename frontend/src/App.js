import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/pages/Auth/Login";
import Home from "./components/pages/Auth/Home";
import Register from "./components/pages/Auth/Register";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Container from "./components/layout/Container";
// Context
import { UserProvider } from "./context/UserContext";
import Message from "./components/layout/Message";
import Profile from "./components/pages/User/Profile";
import MyPets from "./components/pages/Pets/MyPets";
import AddPet from "./components/pages/Pets/AddPet";
import EditPet from "./components/pages/Pets/EditPet";
import PetDetails from "./components/pages/Pets/PetDetails";
import MyAdoptions from "./components/pages/Pets/MyAdoptions";

function App() {
  return (
    <Router>
      <UserProvider>
        <Navbar />
        <Message />
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/users/profile" element={<Profile />} />
            <Route path="/pet/mypets" element={<MyPets />} />
            <Route path="/pet/add" element={<AddPet />} />
            <Route path="/pet/edit/:id" element={<EditPet />} />
            <Route path="/pet/:id" element={<PetDetails />} />
            <Route path="/pet/myadoptions" element={<MyAdoptions />} />
          </Routes>
        </Container>
        <Footer />
      </UserProvider>
    </Router>
  );
}

export default App;
