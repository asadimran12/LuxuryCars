// src/pages/ErrorPage.jsx
import React from "react";
import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();
  console.error("Route error:", error);

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 text-red-800">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Oops!</h1>
        <p className="text-lg mb-4">Something went wrong.</p>
        {error && (
          <p className="text-sm italic">
            {error.status} - {error.statusText || error.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ErrorPage;
