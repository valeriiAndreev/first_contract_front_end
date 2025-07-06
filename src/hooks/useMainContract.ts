import { useEffect, useState } from "react";
import { MainContract } from "../contracts/MainContract";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import type { Address, OpenedContract } from "@ton-core";
import { toNano } from "@ton-core";
import { useTonConnect } from "./useTonConnect";

//const { Address, toNano } = await import('@ton/core');



export function useMainContract() {
  const client = useTonClient();
  const { sender } = useTonConnect();
  const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));
  const [contractData, setContractData] = useState<null | {
    counter_value: number;
    recent_sender: Address;
    owner_address: Address;
  }>();

  const [balance, setBalance] = useState<null | number>(0);

  const mainContract = useAsyncInitialize(async () => {
    if (!client) return null;
    const contract = new MainContract(
      Address.parse("kQDO8uSejPQmvuUz5PLq6qeUaJT9WJLG7NocN27GGsyWrOhL") // replace with your address from tutorial 2 step 8
    );
    return client.open(contract) as OpenedContract<MainContract> & {
    getData: () => Promise<any>;
    getBalance: () => Promise<any>;
    sendIncrement: (...args: any[]) => Promise<void>;
  };
  }, [client]);

  useEffect(() => {
    async function getValue() {
      if (!mainContract) return;
      setContractData(null);
      const val = await mainContract.getData();
      const balance = await mainContract.getBalance();
      setContractData({
        counter_value: val.number,
        recent_sender: val.recent_sender,
        owner_address: val.owner_address,
      });
      setBalance ( balance.balance ) ;
      await sleep(5000); // sleep 5 seconds and poll value again
      getValue();
    }
    getValue();
  }, [mainContract]);

  return {
    contract_address: mainContract?.address.toString(),
    contract_balance: balance,
    ...contractData,
    sendIncrement: () => {
      return mainContract?.sendIncrement(sender, toNano(0.05), 3);
    },
  };
}
