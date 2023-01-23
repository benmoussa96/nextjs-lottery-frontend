import React from "react";
import { useWeb3Contract } from "react-moralis";
import { useMoralis } from "react-moralis";

import { abi, contractAddresses } from "../constants";

interface contractAddressesInterface {
  [key: string]: string[];
}

export default function LotteryEntrance() {
  const addresses: contractAddressesInterface = contractAddresses;
  const { chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex!);

  const raffleAddress = chainId in addresses ? addresses[chainId][0] : null;

  const { runContractFunction: enterRaffle } = useWeb3Contract({
    abi,
    contractAddress: raffleAddress!,
    functionName: "enterRaffle",
    params: {},
    // msgValue: 0,
  });

  return <div>LotteryEntrance</div>;
}
