import { createBrowserRouter } from "react-router";
import Index from "../pages/Index";

export const router = createBrowserRouter([
    { path: '/', element: <Index />, index: true },
])