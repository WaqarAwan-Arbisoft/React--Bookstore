import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Person2Icon from '@mui/icons-material/Person2';
import Badge from '@mui/material/Badge';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import PrimaryBtn1 from '../UI/primary-btn';
import { useDispatch, useSelector } from 'react-redux';
import { authAction } from '../store/auth-slice';
import Cookies from 'universal-cookie'


const AppNavbar = () => {
    const authStates = useSelector(state => state.auth)
    const tempStates = useSelector(state => state.temp);
    const totalItems = tempStates.totalCartItems;
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const dispatch = useDispatch();
    const cookies = new Cookies();
    const navigate = useNavigate();

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    const logoutHandler = () => {
        cookies.remove('app_auth_token')
        dispatch(authAction.logout())
        navigate('/');
    }
    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        <Link to='/'>
                            <img src="/Images/Logo/logo.png" alt="LOGO" width={100} />
                        </Link>
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            <Link to='/' onClick={handleCloseNavMenu}>
                                <Typography textAlign="center" className='p-2'>Books</Typography>
                            </Link>
                        </Menu>
                    </Box>
                    <Typography
                        variant="h5"
                        noWrap
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        <Link to='/'>
                            <img src="/Images/Logo/logo.png" alt="LOGO" width={100} />
                        </Link>
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        <Link to='/'>

                            <Button
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                Books
                            </Button>

                        </Link>
                        {authStates.isAuthenticated ? (
                            <>
                                <Link to='/orders'>

                                    <Button
                                        onClick={handleCloseNavMenu}
                                        sx={{ my: 2, color: 'white', display: 'block' }}
                                    >
                                        Orders
                                    </Button>

                                </Link>
                                <Link to='/feed'>

                                    <Button
                                        onClick={handleCloseNavMenu}
                                        sx={{ my: 2, color: 'white', display: 'block' }}
                                    >
                                        Feed
                                    </Button>

                                </Link>
                                <Link to='/requests'>

                                    <Button
                                        onClick={handleCloseNavMenu}
                                        sx={{ my: 2, color: 'white', display: 'block' }}
                                    >
                                        Requests
                                    </Button>

                                </Link>
                            </>
                        ) : ''}

                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <Link to='/cart'>
                            <div className='mx-3 d-inline'>
                                <ShoppingCartIcon />
                            </div>
                        </Link>
                        {authStates.isAuthenticated && (
                            <>
                                <Tooltip title="Open settings">
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                        <Avatar alt={authStates.name} src={authStates.image} />
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: '45px' }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >

                                    <MenuItem onClick={handleCloseUserMenu} className="d-flex align-items-center">
                                        <Link to={`/user/${authStates.id}`}>
                                            <Typography textAlign="center"><Person2Icon /> Profile</Typography>
                                        </Link>
                                    </MenuItem>
                                </Menu>
                                <PrimaryBtn1 color={'error'} className={"mx-2"} onClick={logoutHandler}>logout</PrimaryBtn1>
                            </>
                        )}

                        {!authStates.isAuthenticated && (
                            <>
                                <Link to='/login'>
                                    <PrimaryBtn1 color={'success'} className={"mx-2"}>Login</PrimaryBtn1>
                                </Link>
                                <Link to='/register'>
                                    <PrimaryBtn1 color={'info'} className={"mx-2"}>Register</PrimaryBtn1>
                                </Link>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar >
    );
}

export default AppNavbar