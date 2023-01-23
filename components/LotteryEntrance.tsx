import React, { useEffect, useState } from "react";
import { ethers, BigNumber, ContractTransaction } from "ethers";
import { useWeb3Contract } from "react-moralis";
import { useMoralis } from "react-moralis";
import { useNotification, Bell } from "web3uikit";

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

  const dispatch = useNotification();

  const { runContractFunction: enterRaffle } = useWeb3Contract({
    abi,
    contractAddress: raffleAddress!,
    functionName: "enterRaffle",
    params: {},
    msgValue: entranceFee,
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

  const handleSuccess = async (txn: ContractTransaction) => {
    await txn.wait(1);
    handleNewNotification();
  };

  const handleNewNotification = async () => {
    dispatch({
      type: "info",
      message: "Transaction Complete!",
      title: "Notification",
      position: "topR",
      icon: <Bell fontSize={20} />,
    });
  };

  useEffect(() => {
    if (isWeb3Enabled) updateUi();
  }, [isWeb3Enabled]);

  return (
    <div>
      LotteryEntrance
      {raffleAddress ? (
        <div>
          <button
            onClick={async () =>
              await enterRaffle({
                onSuccess: (txn) => handleSuccess(txn as ContractTransaction),
                onError: (error) => console.log(error),
              })
            }
          >
            Enter Raffle
          </button>
          <div>Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH</div>
        </div>
      ) : (
        <div>No Raffle contract address detected on this network</div>
      )}
    </div>
  );
}
