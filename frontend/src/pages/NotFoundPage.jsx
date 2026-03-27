import React from "react";
import { XCircle } from "lucide-react";
import Button from "../components/layout/Button";

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6 text-gray-800">
      <XCircle className="mb-6 h-24 w-24 animate-bounce text-[#f5a623]" />
      <h1 className="mb-4 text-5xl font-bold">404</h1>
      <p className="mb-6 text-center text-xl text-gray-600">
        Omlouváme se, stránka, kterou hledáte, neexistuje.
      </p>
      <Button to="/" size="lg">
        Zpět na hlavní stránku
      </Button>
    </div>
  );
};

export default NotFoundPage;
