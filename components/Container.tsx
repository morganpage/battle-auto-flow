import * as fcl from "@onflow/fcl";
import { useEffect, useState } from "react";
import ReadHelloWorld from "../cadence/scripts/ReadHelloWorld.cdc";
import UpdateHelloWorld from "../cadence/transactions/UpdateHelloWorld.cdc";
import elementStyles from "../styles/Elements.module.css";
import containerStyles from "../styles/Container.module.css";
import useConfig from "../hooks/useConfig";
import { createExplorerTransactionLink } from "../helpers/links";
import minionData from "../data/minions.json";

export default function Container() {
  //const [chainGreeting, setChainGreeting] = useState("?");
  const [minions, setMinions] = useState([]);
  const [userGreetingInput, setUserGreetingInput] = useState("");
  const [lastTransactionId, setLastTransactionId] = useState<string>();
  const [transactionStatus, setTransactionStatus] = useState<number>();
  const { network } = useConfig();

  const isEmulator = (network) => network !== "mainnet" && network !== "testnet";
  const isSealed = (statusCode) => statusCode === 4; // 4: 'SEALED'

  useEffect(() => {
    if (lastTransactionId) {
      console.log("Last Transaction ID: ", lastTransactionId);

      fcl.tx(lastTransactionId).subscribe((res) => {
        setTransactionStatus(res.statusString);

        // Query for new chain string again if status is sealed
        if (isSealed(res.status)) {
          queryChain();
        }
      });
    }
  }, [lastTransactionId]);

  const queryChain = async () => {
    const res = await fcl.query({
      cadence: ReadHelloWorld,
    });
    console.log("Query Result: ", res);
    //setChainGreeting(res)
    setMinions(res);
  };

  const mutateMinions = async (event) => {
    event.preventDefault();
    let names = minionData.map((minion) => minion.name);
    let descriptions = minionData.map((minion) => minion.description);
    let tiers = minionData.map((minion) => minion.tier);
    let attacks = minionData.map((minion) => minion.attack);
    let healths = minionData.map((minion) => minion.health);
    const transactionId = await fcl.mutate({
      cadence: UpdateHelloWorld,
      args: (arg, t) => [arg(names, t.Array(t.String)), arg(descriptions, t.Array(t.String)), arg(tiers, t.Array(t.Int)), arg(attacks, t.Array(t.Int)), arg(healths, t.Array(t.Int))],
    });
    setLastTransactionId(transactionId);
  };

  const openExplorerLink = (transactionId, network) => window.open(createExplorerTransactionLink({ network, transactionId }), "_blank");

  return (
    <div className={containerStyles.container}>
      <h2>Query the Chain</h2>
      <div>
        <button onClick={queryChain} className={elementStyles.button}>
          Query
        </button>
        <button onClick={mutateMinions} className={elementStyles.button}>
          Update
        </button>
        <h4>Minions on Chain: {minions?.length}</h4>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Tier</th>
              <th>Attack</th>
              <th>Health</th>
            </tr>
          </thead>
          <tbody>
            {minions.map((minion, index) => (
              <tr key={index}>
                <td>{minion.name}</td>
                <td>{minion.description}</td>
                <td>{minion.tier}</td>
                <td>{minion.attack}</td>
                <td>{minion.health}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <hr />
      <div>
        <h2>Mutate the Chain</h2>
        {!isEmulator(network) && (
          <h4>
            Latest Transaction ID:{" "}
            <a
              className={elementStyles.link}
              onClick={() => {
                openExplorerLink(lastTransactionId, network);
              }}
            >
              {lastTransactionId}
            </a>
          </h4>
        )}
        <h4>Latest Transaction Status: {transactionStatus}</h4>
        {/* <form onSubmit={mutateGreeting}>
          <label>
            <input type="text" placeholder="New Greeting" value={userGreetingInput} onChange={(e) => setUserGreetingInput(e.target.value)} className={elementStyles.input} />
          </label>
          <input type="submit" value="Submit" className={elementStyles.button} />
        </form> */}
      </div>
    </div>
  );
}
