import React from "react";
export default function Test(){

    const web3 = require("@solana/web3.js");

// Airdrop SOL for paying transactions
let payer = web3.Keypair.generate();
let connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');

console.log(connection, 'connection')
let airdropSignature = async() => await connection.requestAirdrop(
    payer.publicKey,
    web3.LAMPORTS_PER_SOL,
);

console.log(airdropSignature, 'airdropsignature')

const fn1 = async() => await connection.confirmTransaction(airdropSignature);


// Allocate Account Data
let allocatedAccount = web3.Keypair.generate();
let allocateInstruction = web3.SystemProgram.allocate({
    accountPubkey: allocatedAccount.publicKey,
    space: 100,
})
let transaction = new web3.Transaction().add(allocateInstruction);

console.log(transaction, 'allocated transaction')
const fn2 = async() => await web3.sendAndConfirmTransaction(connection, transaction, [payer, allocatedAccount])

// Create Nonce Account
let nonceAccount = web3.Keypair.generate();
let minimumAmountForNonceAccount = async() => await connection.getMinimumBalanceForRentExemption(
    web3.NONCE_ACCOUNT_LENGTH,
);

console.log(minimumAmountForNonceAccount, 'minimum amount for nounce account')
let createNonceAccountTransaction = new web3.Transaction().add(
web3.SystemProgram.createNonceAccount({
    fromPubkey: payer.publicKey,
    noncePubkey: nonceAccount.publicKey,
    authorizedPubkey: payer.publicKey,
    lamports: minimumAmountForNonceAccount,
}),
);

const fn3 = async() => await web3.sendAndConfirmTransaction(connection, createNonceAccountTransaction, [payer, nonceAccount])

// Advance nonce - Used to create transactions as an account custodian
let advanceNonceTransaction = new web3.Transaction().add(
    web3.SystemProgram.nonceAdvance({
        noncePubkey: nonceAccount.publicKey,
        authorizedPubkey: payer.publicKey,
    }),
);
console.log(advanceNonceTransaction, 'advance nonce trasaction')
const fn4 = async() => await web3.sendAndConfirmTransaction(connection, advanceNonceTransaction, [payer])

// Transfer lamports between accounts
let toAccount = web3.Keypair.generate();

let transferTransaction = new web3.Transaction().add(
web3.SystemProgram.transfer({
    fromPubkey: payer.publicKey,
    toPubkey: toAccount.publicKey,
    lamports: 1000,
}),
);
console.log(transferTransaction, 'transfer transaction')
const fn5 = async() => await web3.sendAndConfirmTransaction(connection, transferTransaction, [payer])

// Assign a new account to a program
let programId = web3.Keypair.generate();
let assignedAccount = web3.Keypair.generate();

let assignTransaction = new web3.Transaction().add(
web3.SystemProgram.assign({
    accountPubkey: assignedAccount.publicKey,
    programId: programId.publicKey,
}),
);

console.log(assignTransaction, 'assign transaction')
const fula = async() => await web3.sendAndConfirmTransaction(connection, assignTransaction, [payer, assignedAccount]);

return (
    <div className="App"></div>
    );
} 
