import { useSelector } from "react-redux";
import { useLocation, Navigate, Outlet } from "react-router-dom";

const RequireNonAuth = () => {
    const authStates = useSelector(state => state.auth);
    const location = useLocation();
    return (
        !authStates.isAuthenticated ? <Outlet /> : <Navigate to='/' state={{ from: location }} replace />
    );
}

export default RequireNonAuth;