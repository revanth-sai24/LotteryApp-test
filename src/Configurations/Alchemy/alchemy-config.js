//provider
import { createAlchemyWeb3 } from "@alch/alchemy-web3";


// alchemy provider set-up
const alchemyKey =
  "https://eth-goerli.alchemyapi.io/v2/Xn9WOwHwTorvsrB5vMYUZWA5GYIGJkSx";
export const web3 = createAlchemyWeb3(alchemyKey);
export default web3;

// const contractAddress = "0x69053c684d30eb71cd64B6A4c9378Db3d8f3890A";

// const contractABI = abi;

// export const contractInstance = new web3.eth.Contract(contractABI, contractAddress);
