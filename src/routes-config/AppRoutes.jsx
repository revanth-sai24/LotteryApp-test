import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Lottery from "../pages/Lottery";
import LotteryCreation from "../pages/LotteryCreation";

const AppRoutes = () => {
  const location = useLocation();
  return (
    <React.Fragment>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Lottery />} />
        <Route path="/create" element={<LotteryCreation />} />

        <Route path="*" element={<>NOT FOUND</>} />
      </Routes>
    </React.Fragment>
  );
};

export default AppRoutes;
