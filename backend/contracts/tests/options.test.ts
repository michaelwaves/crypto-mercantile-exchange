import { describe, it, expect } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const contractName = "options";

describe("options contract integration test", () => {
  it("runs a full buy-sell lifecycle", () => {
    // Deployer creates the option
    let result = simnet.callPublicFn(contractName, "create-option", [
      Cl.stringAscii("PEPE20250601C00010"), // contract-name
      Cl.stringAscii("PEPE"),               // underlying-asset
      Cl.stringAscii("call"),               // type
      Cl.uint(10),                          // strike-price
      Cl.uint(760000),                      // expiry
      Cl.uint(1),                           // quote-asset-decimals
      Cl.uint(2),                           // base-asset-decimals
      Cl.uint(5),                           // bid price
    ], deployer);
    expect(result.result.type).toBe("ok");


    // Fund the contract
    result = simnet.callPublicFn(contractName, "fund-contract", [
      Cl.uint(100000)
    ], deployer);
    expect(result.result.type).toBe("ok");


    // Wallet_1 buys 5 contracts
    result = simnet.callPublicFn(contractName, "buy-option", [
      Cl.stringAscii("PEPE20250601C00010"),
      Cl.uint(5),
    ], wallet1);
    expect(result.result.type).toBe("ok");

    // Check wallet_1's position
    const readOnly = simnet.callReadOnlyFn(contractName, "get-position", [
      Cl.principal(wallet1),
      Cl.stringAscii("PEPE20250601C00010"),
    ], wallet1);
    expect(readOnly.result).toMatchObject({
      type: "some",
    });

    // Wallet_1 sells 2 contracts
    result = simnet.callPublicFn(contractName, "sell-option", [
      Cl.stringAscii("PEPE20250601C00010"),
      Cl.uint(2),
    ], wallet1);
    expect(result.result.type).toBe("ok");


    // Optionally, deployer deletes the option
    result = simnet.callPublicFn(contractName, "delete-option", [
      Cl.stringAscii("PEPE20250601C00010"),
    ], deployer);
    expect(result.result.type).toBe("ok");

  });
});