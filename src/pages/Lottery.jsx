import { Box, Button, Chip, Container, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

import contractABI from "../contract/contractABI.json";
import { web3 } from "../Configurations/Alchemy/alchemy-config";
import { useAccount, useContractWrite } from "wagmi";
import { toast } from "react-toastify";

const Lottery = () => {
  const [lotteryStatus, setLotteryStatus] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [lotteryCount, setLotteryCout] = useState(null);
  const [price, setPrice] = useState(null);
  const [useBt, setUseBt] = useState(false);
  const { address } = useAccount();

  const [timing, setTiming] = useState(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const targetTime = new Date(1701412148);
      console.log(targetTime);
      const timeDiff = targetTime - now;
      console.log(timeDiff);
      if (timeDiff <= 0) {
        clearInterval(intervalId);
        // setRemainingTime("Time expired");
      } else {
        const hours = Math.floor(timeDiff / 3600000);
        const minutes = Math.floor((timeDiff % 3600000) / 60000);
        const seconds = Math.floor((timeDiff % 60000) / 1000);
        //setRemainingTime(`${hours}h ${minutes}m ${seconds}s`);
        console.log(seconds);
      }
    }, 1000);
    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const contractInstance = new web3.eth.Contract(
        contractABI,
        "0x69053c684d30eb71cd64B6A4c9378Db3d8f3890A"
      );
      const status = await contractInstance.methods.lotteryStatus().call();
      setLotteryStatus(status);
      if (status) {
        const endTime = await contractInstance.methods.endTime().call();
        const lotteryCount = await contractInstance.methods
          .lotteryCount()
          .call();
        const ticketPrice = await contractInstance.methods.ticketPrice().call();

        setEndTime(endTime);
        // setRemainingTime(endTime);
        setLotteryCout(lotteryCount);
        setPrice(ticketPrice);
      }
    };
    fetchData();
  }, []);

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
          setUseBt(false);
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
          setUseBt(false);
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
      setUseBt(false);
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
    value: price,
    functionName: "buyTickets",
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
      setUseBt(false);
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
        setUseBt(false);
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
  const buyTicket = async () => {
    write({
      from: address,
    });
  };

  return (
    <Box sx={{ mt: 13 }}>
      <Container>
        <Typography variant="h4" textAlign={"center"}>
          {lotteryStatus
            ? `Lottery No-${lotteryCount}`
            : "Lottery not Started Yet"}
        </Typography>

        {lotteryStatus && (
          <Box>
            <Typography variant="body1">Price-{price}</Typography>
            <Typography variant="body1">End Time- {endTime}</Typography>
            <Typography variant="body1"> {timing}</Typography>

            <Button variant="contained" onClick={buyTicket}>
              Buy
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Lottery;
