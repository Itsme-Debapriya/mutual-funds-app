"use client"

import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./contexts/AuthContext"
import Header from "./components/layout/Header"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import SearchPage from "./pages/SearchPage"
import FundDetailsPage from "./pages/FundDetailsPage"
import SavedFundsPage from "./pages/SavedFundsPage"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import LoadingSpinner from "./components/ui/LoadingSpinner"

function App() {
  const { isLoading } = useAuth()

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <SearchPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/funds/:id"
            element={
              <ProtectedRoute>
                <FundDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/saved-funds"
            element={
              <ProtectedRoute>
                <SavedFundsPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
