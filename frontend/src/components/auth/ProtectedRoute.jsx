"use client"

import { Navigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import LoadingSpinner from "../ui/LoadingSpinner"

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}
