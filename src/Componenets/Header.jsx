import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

//third-party Imports
import {
  AppBar,
  Button,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  CssBaseline,
  Stack,
  IconButton,
} from "@mui/material";
// import MenuIcon from "@mui/icons-material/Menu";
// import SearchIcon from "@mui/icons-material/Search";
import LoadingBar from "react-top-loading-bar";
// import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
// import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { toast } from "react-toastify";
//import axios from "axios";
import { useWeb3Modal } from "@web3modal/react";
import {
  useAccount,
  useBalance,
  useDisconnect,
  useNetwork,
  useSwitchNetwork,
} from "wagmi";

import MenuIcon from "@mui/icons-material/Menu";

//project Imports

const Header = () => {
  const { chain } = useNetwork();
  const navigate = useNavigate();

  //material ui theme
  const theme = useTheme();

  //pathname from react-router-dom
  // const { pathname } = useLocation();

  // media query from material ui for checking breakpoint of UI
  const isMatch = useMediaQuery(theme.breakpoints.down("md"));

  //state
  //const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);

  // sign message variable
  // eslint-disable-next-line no-unused-vars
  const [message, setMessage] = React.useState();

  //disableing the connect from sending multiple requests
  const [connectDisable, setConnectDisable] = useState(false);

  //web3Modal hook
  const { open } = useWeb3Modal();

  //disconnect hook from wagmi
  const { disconnect } = useDisconnect();

  //wagmi hook for network switch
  const { error, switchNetwork } = useSwitchNetwork();

  //wagmi hook for accounts
  const { address, isConnected } = useAccount({
    onDisconnect() {
      console.log("Disconnected");
      setConnectDisable(false);
      navigate("/");
      toast("Disconnected", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    },
  });

  //balances
  const balance = useBalance({
    address: address,
  });

  // if user rejected the network switch, showing until he/she connects
  useEffect(() => {
    const er = JSON.stringify(error);
    const parsedError = JSON.parse(er);
    if (parsedError?.details === "User rejected the request.") {
      switchNetwork?.(5);
      // switchNetwork?.(80001);
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  //handling accounts changed
  useEffect(() => {
    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0) {
        disconnect();
        localStorage.removeItem("jwtToken");
      }
    };
    window.ethereum &&
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    // window.ethereum &&
    //   window.ethereum.on("chainChanged", handleAccountsChanged);

    return () => {
      window.ethereum &&
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      // window.ethereum &&
      //   window.ethereum.removeListener("chainChanged", handleAccountsChanged);
    };
  }, [chain?.id, disconnect]);

  //account updates

  const loadingRef = useRef(null);

  //location
  const location = useLocation();
  const navLinkHandler = (type) => {
    // if (address === undefined) {
    //   //localStorage.setItem("navigateToService", "/rooms");
    //   navigate(`/auth/rooms`);
    // } else {
    //   navigate("/rooms");
    // }
  };
  //seller Dashboard items
  const dashboardNavbar = [];
  return (
    <React.Fragment>
      <AppBar
        sx={{
          backgroundColor: "#023047",
        }}
      >
        <CssBaseline />
        <React.Fragment>
          <LoadingBar
            height={"4px"}
            color={"white"}
            ref={loadingRef}
            shadow={true}
          />
        </React.Fragment>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            height: "100px",
          }}
        >
          {isMatch ? (
            <>
              <Box
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
                // onClick={() => navigate("/")}
              >
                <IconButton
                  sx={{ color: "white", float: "left" }}
                  onClick={() => setOpenDrawer(!openDrawer)}
                >
                  <MenuIcon color="white" />
                </IconButton>
              </Box>
              <Typography
                variant="caption"
                sx={{
                  fontSize: "18px",
                  cursor: "pointer",
                }}
                onClick={() => navigate("/")}
              >
                LG
              </Typography>

              {/* drawer start */}
              <React.Fragment>
                <Drawer
                  anchor="left"
                  open={openDrawer}
                  onClose={() => setOpenDrawer(false)}
                >
                  <List>
                    {dashboardNavbar.map((item) => {
                      return (
                        <ListItemButton
                          key={item.pageName}
                          onClick={() => {
                            navigate(item.navigateTo);
                            setOpenDrawer(false);
                          }}
                        >
                          <ListItemIcon>
                            <ListItemText>{item.pageName}</ListItemText>
                          </ListItemIcon>
                        </ListItemButton>
                      );
                    })}
                  </List>
                </Drawer>
                <Box
                  sx={{
                    display: "flex",
                    direction: "row",
                  }}
                >
                  <Button
                    // className="connectBt"
                    size="large"
                    onClick={() => navigate("/create")}
                    color="inherit"
                    variant="outlined"
                  >
                    create
                  </Button>
                  {address && (
                    <Button
                      // className="connectBt"
                      size="large"
                      onClick={() => {
                        open();
                        setConnectDisable(isConnected ? false : true);
                      }}
                      disabled={connectDisable}
                      color="inherit"
                      variant="outlined"
                    >
                      {isConnected
                        ? `${balance.data?.formatted.slice(0, 5)} ${
                            balance.data?.symbol
                          }  ` +
                          String(address).substring(0, 1) +
                          "..." +
                          String(address).substring(38)
                        : "Connect"}
                    </Button>
                  )}
                </Box>
              </React.Fragment>
              {/* drawer ends */}
            </>
          ) : (
            <>
              <Box
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    cursor: "pointer",
                  },
                  color: "white",
                }}
                onClick={() => navigate("/")}
              >
                <Typography
                  sx={{
                    fontSize: "25px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  LottoGains
                </Typography>
              </Box>
              <Box
                sx={{
                  flexGrow: 1,
                  display: { xs: "none", md: "flex" },
                  justifyContent: "center",
                }}
              >
                {dashboardNavbar.map((page) => (
                  <Button
                    sx={{
                      cursor: "pointer",
                      my: 2,
                      color: "white",
                      display: "block",
                      // p:2
                    }}
                    //fontWeight={550}
                    key={page.pageName}
                    // onClick={handleCloseNavMenu}
                    onClick={() => {
                      navigate(page.navigateTo);
                    }}
                  >
                    {page.pageName}
                  </Button>
                ))}
              </Box>
              <Box>
                <Stack gap={1} direction={"row"}>
                  {location.pathname === "/user" && (
                    <Button
                      // className="connectBt"
                      size="large"
                      color="inherit"
                      variant="text"
                      onClick={() => navigate("/buyTokens")}
                    >
                      Buy Tokens
                    </Button>
                  )}
                  {address && (
                    <Button
                      // className="connectBt"
                      size="large"
                      onClick={() => {
                        open();
                        setConnectDisable(isConnected ? false : true);
                      }}
                      disabled={connectDisable}
                      color="inherit"
                      variant="outlined"
                    >
                      {isConnected
                        ? `${balance.data?.formatted.slice(0, 5)} ${
                            balance.data?.symbol
                          }  ` +
                          String(address).substring(0, 7) +
                          "..." +
                          String(address).substring(38)
                        : "Connect"}
                    </Button>
                  )}
                  <Button
                    // className="connectBt"
                    size="large"
                    onClick={() => navigate("/create")}
                    color="inherit"
                    variant="outlined"
                  >
                    create
                  </Button>
                </Stack>
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

export default Header;
