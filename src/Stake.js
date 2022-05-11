import React from "react";
export default function Stake(){
    const {Authorized, Keypair, Lockup, StakeProgram} = require("@solana/web3.js");

    let account = Keypair.generate();
    let stakeAccount = Keypair.generate();
    let authorized = new Authorized(account.publicKey, account.publicKey);
    let lockup = new Lockup(0, 0, account.publicKey);

    let createStakeAccountInstruction = StakeProgram.createAccount({
        fromPubkey: account.publicKey,
        authorized: authorized,
        lamports: 1000,
        lockup: lockup,
        stakePubkey: stakeAccount.publicKey
    });
    console.log(createStakeAccountInstruction, 'stake account')
    return (
        <div className="App"></div>
    );

}