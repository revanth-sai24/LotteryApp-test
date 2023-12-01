import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useAccount, useContractWrite } from "wagmi";
import { object, number, string } from "yup";
import contractABI from "../contract/contractABI.json";
import web3 from "../Configurations/Alchemy/alchemy-config";
import { useWeb3Modal } from "@web3modal/react";

const LotteryCreation = () => {
  const [createBt, setCreateBt] = useState(false);
  const { address } = useAccount();
  const { open } = useWeb3Modal();

  /**
   * Checks the transaction is Succeeded of Failed
   * Checks for receipt if none are found calls the same function again to see if any are there, If any were found
   * then displaying the status
   * @param {String} txHash
   * @returns
   */
  const transactionRecipet = async (txHash) => {
    try {
      //checking for recipe using alchemy
      const receipt = await web3.eth.getTransactionReceipt(txHash);
      if (receipt) {
        console.log("transaction receipt", receipt);
        if (receipt.status) {
          console.log("transactionRecipet Transaction was successful!");
          toast.success("😍 Transaction Succesful...", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          //QR-code generation
          setCreateBt(false);
          //checking tokens
          return true;
        } else {
          console.log("transactionRecipet Transaction failed.");

          toast.error("Transaction Failed...", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          //button state
          setCreateBt(false);
          return false;
        }
      } else {
        console.log(
          "Transaction receipt not found. The transaction may not be mined yet."
        );
        // calling again if there is no recipet
        transactionRecipet(txHash);
      }
    } catch (error) {
      setCreateBt(false);
      toast.error(
        `"Error occurred while checking transaction receipt:",
          ${error.message}`,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        }
      );
      console.error(
        "Error occurred while checking transaction receipt:",
        error.message
      );
    }
  };
  const { write } = useContractWrite({
    address: "0x69053c684d30eb71cd64B6A4c9378Db3d8f3890A",
    abi: contractABI,
    functionName: "createNewRound",
    onSuccess(data) {
      console.log("wait for confirmation", data);
      toast("Tx Initiated...", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    },
    onError(error) {
      console.log("admin mint Error", error);

      toast.error("Purchase Failed", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      //button state
      setCreateBt(false);
    },
    onSettled(data, error) {
      if (error) {
        const errorStringify = JSON.stringify(error);
        const errorParse = JSON.parse(errorStringify);
        console.log("admin mint error from settlement", errorParse);
        toast.error(errorParse?.shortMessage, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setCreateBt(false);
      } else {
        console.log("placeBidTransaction data hash", data.hash);
        toast("Tx settled wait for confirmation", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        transactionRecipet(data.hash);
      }
    },
  });
  const lotteryFormik = useFormik({
    initialValues: {
      time: "",
      price: "",
    },
    validationSchema: object({
      price: number("Enter Price").required("Price is required").positive(),
      time: string("Enter End Time ").required("Time is required"),
    }),
    onSubmit: async (values) => {
      console.log("Formik values", values);
      setCreateBt(true);

      //sending transaction
      write({
        args: [values.time, values.price],
        from: address,
      });
    },
  });
  return (
    <Box sx={{ mt: 13 }}>
      <Container maxWidth="sm">
        <Typography variant="h5">LotteryCreation</Typography>
        {!address ? (
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={() => {
              open();
              //setConnectDisable(true);
              // setConnectDisable(isConnected ? false : true);
            }}
          >
            connect
          </Button>
        ) : address === "0x2845B72FDd60f2fa76470069d05a4D8dfCCDBFE7" ? (
          <Grid container spacing={3} marginTop={"5px"}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <TextField
                variant="outlined"
                autoComplete="given-name"
                name="time"
                required
                fullWidth
                id="time"
                label="End Time"
                value={lotteryFormik.values.time}
                onChange={lotteryFormik.handleChange}
                helperText={lotteryFormik.errors.time}
                error={lotteryFormik.errors.time ? true : false}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <TextField
                variant="outlined"
                autoComplete="given-name"
                name="price"
                required
                fullWidth
                id="price"
                label="Price"
                value={lotteryFormik.values.price}
                onChange={lotteryFormik.handleChange}
                helperText={lotteryFormik.errors.price}
                error={lotteryFormik.errors.price ? true : false}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button
                variant="contained"
                onClick={lotteryFormik.handleSubmit}
                disabled={!(lotteryFormik.isValid && lotteryFormik.dirty)}
              >
                {createBt ? "Creating..." : "Create"}
              </Button>
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button
                variant="contained"
                //onClick={lotteryFormik.handleSubmit}
                //disabled={!(lotteryFormik.isValid && lotteryFormik.dirty)}
              >
                Pick Winner
              </Button>
            </Grid>
          </Grid>
        ) : (
          <Typography variant="body1">Not Owner</Typography>
        )}
      </Container>
    </Box>
  );
};

export default LotteryCreation;
