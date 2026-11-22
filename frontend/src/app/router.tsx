import { createBrowserRouter, Navigate } from "react-router";
import HomePage from "../pages/home/HomePage";
import AuthLayout from "../layouts/AuthLayout";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import MainLayout from "../layouts/MainLayout";
import GuestRoute from "../components/GuestRoute";
import ProfilePage from "../pages/profile/ProfilePage";
import ProtectedRoute from "../components/ProtectedRoute";
import EditProfilePage from "../pages/settings/EditProfilePage";
import SettingsLayout from "../layouts/SettingsLayout";
import CreatePostPage from "../pages/posts/CreatePostPage";

export const router = createBrowserRouter([
    {
        element: <AuthLayout />,
        children: [{
            element: <GuestRoute />,
            children: [
                { path: "/login", element: <LoginPage /> },
                { path: "/register", element: <RegisterPage /> },
            ],
        }]
    },
    {
        path: "/",
        element: <MainLayout />,
        children: [
            { index: true, element: <HomePage /> },
            { path: "users/:username", element: <ProfilePage />},
            {
                element: <ProtectedRoute />,
                children: [
                    { path: "posts/new", element: <CreatePostPage /> },
                    { path: "settings", element: <SettingsLayout />,
                        children: [
                            { index: true, element: <Navigate replace to="profile" /> },
                            {path: "profile", element: <EditProfilePage /> }
                        ]
                    }
                ]
            }
        ]
    }
])