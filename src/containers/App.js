import React from "react";
import { Route } from "react-router-dom";

import Navigation from "../components/Navigation";
import Dashboard from "./pages/Dashboard";

export const App = () =>
  <div>
    <Navigation />
    <Route location="/" component={Dashboard} />
  </div>;

export default App;
