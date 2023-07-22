import React, { Component } from "react";
import { Route, Navigate } from "react-router-dom";

const ProtectedRouteRenderer = ({ user, path, element: Component }) => {
    return user ? <Route path={path} element={<Component />} /> : <Navigate to="/register" />;
};

export default ProtectedRouteRenderer