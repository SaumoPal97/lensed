import { getSigner } from "./ethers-service";
import { ethers } from "ethers";
import { LENS_HUB_CONTRACT_ADDRESS, LENS_HUB_CONTRACT_ABI } from "./constants";

// lens contract info can all be found on the deployed
// contract address on polygon.
// not defining here as it will bloat the code example
export const lensHub = new ethers.Contract(
  LENS_HUB_CONTRACT_ADDRESS,
  LENS_HUB_CONTRACT_ABI,
  getSigner()
);
