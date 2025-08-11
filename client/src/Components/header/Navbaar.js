// src/Components/header/Navbaar.js
import React, { useContext, useEffect, useState } from 'react';
import "../header/navbaar.css";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { NavLink, useHistory } from "react-router-dom";
import { Logincontext } from "../context/Contextprovider";
import { ToastContainer, toast } from "react-toastify";
import LogoutIcon from "@mui/icons-material/Logout";
import "react-toastify/dist/ReactToastify.css";
import { makeStyles } from "@material-ui/core";
import { Drawer, IconButton, List, ListItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Rightheader from "./Rightheader";
import { getProducts } from "../redux/actions/action";
import { useSelector, useDispatch } from "react-redux";
import API_BASE from '../../config';

const usestyle = makeStyles({ component: { marginTop: 10, marginRight: "-50px", width: "300px", padding: 50, height: "300px" } });

const Navbaar = () => {
  const classes = usestyle();
  const history = useHistory();
  const [text, setText] = useState('');
  const { products = [] } = useSelector((state) => state.getproductsdata || {});
  const dispatch = useDispatch();

  useEffect(() => { dispatch(getProducts()); }, [dispatch]);

  const [open, setOpen] = useState(null);
  const [liopen, setLiopen] = useState(true);
  const [dropen, setDropen] = useState(false);

  const handleClick = (event) => setOpen(event.currentTarget);
  const handleClose = () => setOpen(null);

  const { account, setAccount } = useContext(Logincontext);

  const getdetailsvaliduser = async () => {
    try {
      const res = await fetch(`${API_BASE}/validuser`, { method: 'GET', credentials: 'include' });
      if (!res.ok) return; // not logged in, quietly ignore
      const data = await res.json();
      setAccount(data);
    } catch (err) {
      console.error('validuser error', err);
    }
  };

  useEffect(() => {
    getdetailsvaliduser();
  }, []);

  const logoutuser = async () => {
    try {
      const res = await fetch(`${API_BASE}/logout`, { method: 'GET', credentials: 'include' });
      if (!res.ok) throw new Error('Logout failed');
      setAccount(null);
      setOpen(null);
      toast.success("user Logout!", { position: "top-center" });
      history.push("/");
    } catch (error) {
      console.error('logout error', error);
    }
  };

  const handelopen = () => setDropen(true);
  const handleClosedr = () => setDropen(false);
  const getText = (t) => { setText(t); setLiopen(false); };

  return (
    <header>
      <nav>
        <div className="left">
          <IconButton className="hamburgur" onClick={handelopen}><MenuIcon style={{ color: "#fff" }} /></IconButton>
          <Drawer open={dropen} onClose={handleClosedr}><Rightheader userlog={logoutuser} logclose={handleClosedr} /></Drawer>
          <div className="navlogo"><NavLink to="/"><img src="./amazon_PNG25.png" alt="logo" /></NavLink></div>

          <div className="nav_searchbaar">
            <input type="text" onChange={(e) => getText(e.target.value)} placeholder="Search Your Products" />
            <div className="search_icon"><i className="fas fa-search" id="search"></i></div>
            {text && (
              <List className="extrasearch" hidden={liopen}>
                {products
                  .filter(product => product?.title?.longTitle?.toLowerCase().includes(text.toLowerCase()))
                  .map(product => (
                    <ListItem key={product.id}>
                      <NavLink to={`/getproductsone/${product.id}`} onClick={() => setLiopen(true)}>{product.title.longTitle}</NavLink>
                    </ListItem>
                  ))}
              </List>
            )}
          </div>
        </div>

        <div className="right">
          <div className="nav_btn"><NavLink to="/login">Sign in</NavLink></div>
          {account ? (
            <NavLink to="/buynow">
              <div className="cart_btn">
                <Badge badgeContent={account?.carts?.length || 0} color="secondary">
                  <i className="fas fa-shopping-cart" id="icon"></i>
                </Badge>
                <p>Cart</p>
              </div>
            </NavLink>
          ) : (
            <NavLink to="/login">
              <div className="cart_btn">
                <Badge badgeContent={0} color="secondary"><i className="fas fa-shopping-cart" id="icon"></i></Badge>
                <p>Cart</p>
              </div>
            </NavLink>
          )}

          {account ? (
            <Avatar className="avtar2" onClick={handleClick} title={account?.fname?.toUpperCase()}>
              {account?.fname?.[0]?.toUpperCase() || 'U'}
            </Avatar>
          ) : (
            <Avatar className="avtar" onClick={handleClick} />
          )}

          <div className="menu_div">
            <Menu anchorEl={open} open={Boolean(open)} onClose={handleClose} className={classes.component}>
              <MenuItem onClick={handleClose} style={{ margin: 10 }}>My account</MenuItem>
              {account && (
                <MenuItem style={{ margin: 10 }} onClick={() => { handleClose(); logoutuser(); }}>
                  <LogoutIcon style={{ fontSize: 16, marginRight: 3 }} /> Logout
                </MenuItem>
              )}
            </Menu>
          </div>
          <ToastContainer />
        </div>
      </nav>
    </header>
  );
};

export default Navbaar;
