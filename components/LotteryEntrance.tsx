import React, { useEffect, useState } from "react";
import { ethers, BigNumber } from "ethers";
import { useWeb3Contract } from "react-moralis";
import { useMoralis } from "react-moralis";

import { abi, contractAddresses } from "../constants";

interface contractAddressesInterface {
  [key: string]: string[];
}

export default function LotteryEntrance() {
  const [entranceFee, setEntranceFee] = useState("0");

  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex!);
  const addresses: contractAddressesInterface = contractAddresses;
  const raffleAddress = chainId in addresses ? addresses[chainId][0] : null;

  const { runContractFunction: enterRaffle } = useWeb3Contract({
    abi,
    contractAddress: raffleAddress!,
    functionName: "enterRaffle",
    params: {},
    // msgValue: 0,
  });

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi,
    contractAddress: raffleAddress!,
    functionName: "getEntranceFee",
    params: {},
  });

  const updateUi = async () => {
    const entranceFee = ((await getEntranceFee()) as BigNumber).toString();
    setEntranceFee(entranceFee);
  };

  useEffect(() => {
    if (isWeb3Enabled) updateUi();
  }, [isWeb3Enabled]);

  return (
    <div>
      LotteryEntrance
      {raffleAddress ? (
        <div>Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH</div>
      ) : (
        <div>No Raffle contract address detected on this network</div>
      )}
    </div>
  );
}
