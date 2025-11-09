import { Fragment } from "react";
import { Route, Routes } from "react-router-dom";
import Booking from "./pages/Booking";
import Home from "./pages/Home";
import ConfirmationPage from "./components/ConfirmationPage/ConfirmationPage";
import SignUpPage from "./pages/signUpPage/signUpPage";
import LoginPage from "./pages/loginPage/loginPage";
import ProfilePage from "./pages/profilePage/Profile";
import { useSelector } from "react-redux";
import SearchResults from "./pages/searchResults/SearchResults";
import TravellerDetails from "./pages/travellerDetails/TravellerDetails";
import ProfileBadges from "./components/profileBadges/ProfileBadges";

const App = () => {

  const { user } = useSelector((state) => state.user);


  return (
    <Fragment>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Booking" element={<Booking />} />
        <Route path="/Profile" element={<ProfilePage user={user} />} />
        <Route path="/results" element={<SearchResults />} />
        <Route path='/results/TravellerDetails' element={<TravellerDetails />} />
        <Route path='/results/Traveller/confirmed' element={<ConfirmationPage />} />
        <Route path="/signUp" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/Profile/Badges" element={<ProfileBadges user={user} />} />
      </Routes>
    </Fragment>
  )
};

export default App;
