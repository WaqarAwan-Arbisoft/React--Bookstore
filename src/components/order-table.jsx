import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import Loader from './loader';

function Row(props) {
    const { order } = props;
    const authStates = useSelector(states => states.auth)
    const [open, setOpen] = useState(false);
    const [orderDetail, setOrderDetail] = useState([])
    const [isLoaded, setIsLoaded] = useState(false);
    const fetchOrderDetail = async () => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/shop/fetch-order-detail/${order.id}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authStates.token
            }
        })
        if (response.ok) {
            let respData = await response.json()
            setOrderDetail([...respData])
            setIsLoaded(true)
        }
        else {
            setOrderDetail([])
            setIsLoaded(true)
        }
    }
    useEffect(() => {
        fetchOrderDetail();
    }, [])
    return (
        <>
            {isLoaded ? (
                <React.Fragment>
                    <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                        <TableCell>
                            <IconButton
                                aria-label="expand row"
                                size="small"
                                onClick={() => setOpen(!open)}
                            >
                                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            </IconButton>
                        </TableCell>
                        <TableCell component="th" scope="row">
                            {order.id}
                        </TableCell>
                        <TableCell align="right">{order.totalPrice}</TableCell>
                        <TableCell align="right">{order.totalQty}</TableCell>
                        <TableCell align="right">{order.creation}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                            <Collapse in={open} timeout="auto" unmountOnExit >
                                <Box sx={{ margin: 1 }}>
                                    <Typography variant="h6" gutterBottom component="div">
                                        Order Items Details
                                    </Typography>
                                    <Table size="small" aria-label="purchases">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell className='fw-bold'>Book Name</TableCell>
                                                <TableCell className='fw-bold'>Price ($)</TableCell>
                                                <TableCell className='fw-bold' align="right">Quantity</TableCell>
                                                <TableCell className='fw-bold' align="right">Total price ($)</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {orderDetail.map((detail, index) => (

                                                <TableRow component="tr" key={index}>
                                                    <TableCell component="th" scope="row">
                                                        {detail.book.name}
                                                    </TableCell>
                                                    <TableCell>{detail.book.price}</TableCell>
                                                    <TableCell align="right">{detail.quantity}</TableCell>
                                                    <TableCell align="right">
                                                        {Math.round(detail.quantity * detail.book.price)}
                                                    </TableCell>
                                                </TableRow>

                                            ))}

                                        </TableBody>
                                    </Table>
                                </Box>
                            </Collapse>
                        </TableCell>
                    </TableRow>
                </React.Fragment>
            ) : <div className='mx-auto'>
                <Loader width="75" height="75" />
            </div>}
        </>
    );
}

export default function OrderTable(props) {
    const { orders } = props;
    return (
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell className='fw-bold'>Order ID</TableCell>
                        <TableCell align="right" className='fw-bold'>Total Price&nbsp;(g)</TableCell>
                        <TableCell align="right" className='fw-bold'>Total Quantity</TableCell>
                        <TableCell align="right" className='fw-bold'>Order Date</TableCell>
                        <TableCell align="right" className='fw-bold'></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders.map((order, index) => (
                        <Row key={index} order={order} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
