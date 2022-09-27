import { useSelector } from "react-redux";
import { useLocation, Navigate, Outlet } from "react-router-dom";

const RequireAuth = () => {
    const authStates = useSelector(state => state.auth);
    const location = useLocation();
    return (
        authStates.isAuthenticated ? <Outlet /> : <Navigate to='login' state={{ from: location }} replace />
    );
}

export default RequireAuth;