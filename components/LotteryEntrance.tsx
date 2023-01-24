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
  const [numPlayers, setNumPlayers] = useState("0");
  const [recentWinner, setRecentWinner] = useState("0");

  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex!);
  const addresses: contractAddressesInterface = contractAddresses;
  const raffleAddress = chainId in addresses ? addresses[chainId][0] : null;

  const dispatch = useNotification();

  const {
    runContractFunction: enterRaffle,
    isLoading,
    isFetching,
  } = useWeb3Contract({
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

  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi,
    contractAddress: raffleAddress!,
    functionName: "getNumberOfPlayers",
    params: {},
  });

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi,
    contractAddress: raffleAddress!,
    functionName: "getRecentWinner",
    params: {},
  });

  const updateUi = async () => {
    if (raffleAddress) {
      const entranceFee = ((await getEntranceFee()) as BigNumber).toString();
      setEntranceFee(entranceFee);

      const numPayers = ((await getNumberOfPlayers()) as BigNumber).toString();
      setNumPlayers(numPayers);

      const recentWinner = (await getRecentWinner()) as string;
      setRecentWinner(recentWinner);
    }
  };

  const handleSuccess = async (txn: ContractTransaction) => {
    await txn.wait(1);
    handleNewNotification();
    updateUi();
  };

  const handleNewNotification = async () => {
    dispatch({
      type: "success",
      message: "Raffle Entered!",
      title: "Transaction Notification",
      position: "topR",
      icon: <Bell fontSize={20} />,
    });
  };

  useEffect(() => {
    if (isWeb3Enabled) updateUi();
  }, [isWeb3Enabled, chainId]);

  return (
    <div className="p-5">
      {raffleAddress ? (
        <div>
          <h1 className="text-2xl">Enter the lottery</h1>
          <button
            className="bg-blue-500 hover:bg-blue-700 disabled:bg-blue-300 text-white fron-bold py-2 px-4 rounded ml-auto w-32 flex justify-center float-right"
            onClick={async () =>
              await enterRaffle({
                onSuccess: (txn) => handleSuccess(txn as ContractTransaction),
                onError: (error) => console.log(error),
              })
            }
            disabled={isLoading || isFetching}
          >
            {isLoading || isFetching ? (
              <div className="animate-spin spinner-border h-6 w-6 border-b-2 rounded-full"></div>
            ) : (
              "Enter Raffle"
            )}
          </button>
          <div>Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH</div>
          <div>Number Of Players: {numPlayers}</div>
          <div>Recent Winner: {recentWinner}</div>
        </div>
      ) : (
        <div>
          <div className="font-bold">Cannot enter raffle!</div>
          <div>Possible reasons:</div>
          <div>1. Wallet is not connected</div>
          <div>2. Raffle smart contract not available on the selected network</div>
        </div>
      )}
    </div>
  );
}
