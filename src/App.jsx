/*elsint-disable react/prop-types */
/*eslint-disable no-unused-vars */
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
// import Product from "./pages/Product";
// import HomePage from "./pages/Homepage";
// import Pricing from "./pages/Pricing";
// import NotFound from "./pages/PageNotFound";
// import AppLayout from "./pages/AppLayout";
// import Login from "./pages/Login";
import CityList from "./components/CityList";
import CountryList from "./components/CountryList";
import City from "./components/City";
import Form from "./components/Form";
import { Navigate } from "react-router-dom";
import { useCities, CitiesProvider } from "./contexts/CitiesContext";
import { useAuth, AuthProvider } from "./contexts/FakeAuthContext";
import ProtectedRoute from "./pages/ProtectedRoute";
import SpinnerFullPage from "./components/SpinnerFullPage";


const Product = lazy(() => import("./pages/Product"));
const HomePage = lazy(() => import("./pages/Homepage"));
const Pricing = lazy(() => import("./pages/Pricing"));
const NotFound = lazy(() => import("./pages/PageNotFound"));
const AppLayout = lazy(() => import("./pages/AppLayout"));
const Login = lazy(() => import("./pages/Login"));

// dist/index.html                   0.45 kB │ gzip:   0.29 kB
// dist/assets/index-CStsnSjK.css   45.88 kB │ gzip:  11.30 kB
// dist/assets/index-JRQdMI6c.js   511.48 kB │ gzip: 149.25 kB

function App() {

  return (
    <CitiesProvider>
    <AuthProvider>
    <BrowserRouter>
    <Suspense fallback={<SpinnerFullPage />}>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="product" element={<Product />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="app" element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }>
          <Route
            index
            element={< Navigate replace to="cities" />}
          />
          <Route
            path="cities"
            element={<CityList />}
          />
          <Route path="cities/:id" element={<City />} />
          <Route
            path="countries"
            element={<CountryList />}
          />
          <Route path="form" element={<Form />} />
        </Route>
        <Route path="login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
     
      </Routes>
    </Suspense>
    </BrowserRouter>
    </AuthProvider>
    </CitiesProvider>
  );
}

export default App;
