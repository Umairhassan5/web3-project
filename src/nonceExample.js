import React from 'react';
const web3 = require('@solana/web3.js');
export default function Nonce(){


    // Fund a key to create transactions
    let fromPublicKey = web3.Keypair.generate();
    let connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');
    
    let airdropSignature = async() => await connection.requestAirdrop(
        fromPublicKey.publicKey,
        web3.LAMPORTS_PER_SOL,
    );
   const connec = async() => await connection.confirmTransaction(airdropSignature);
    
    // Create Account
    let stakeAccount = web3.Keypair.generate();
    let authorizedAccount = web3.Keypair.generate();
    /* Note: This is the minimum amount for a stake account -- Add additional Lamports for staking
        For example, we add 50 lamports as part of the stake */
    let lamportsForStakeAccount = async() => (await connection.getMinimumBalanceForRentExemption(web3.StakeProgram.space)) + 50;
    
    let createAccountTransaction = web3.StakeProgram.createAccount({
        fromPubkey: fromPublicKey.publicKey,
        authorized: new web3.Authorized(authorizedAccount.publicKey, authorizedAccount.publicKey),
        lamports: lamportsForStakeAccount,
        lockup: new web3.Lockup(0, 0, fromPublicKey.publicKey),
        stakePubkey: stakeAccount.publicKey
    });
   const sendConnect =  async() => await web3.sendAndConfirmTransaction(connection, createAccountTransaction, [fromPublicKey, stakeAccount]);
    
    // Check that stake is available
    let stakeBalance = async() =>  await connection.getBalance(stakeAccount.publicKey);
    console.log(`Stake balance: ${stakeBalance}`)
    // Stake balance: 2282930
    
    // We can verify the state of our stake. This may take some time to become active
    let stakeState = async() => await connection.getStakeActivation(stakeAccount.publicKey);
    console.log(`Stake state: ${stakeState.state}`);
    // Stake state: inactive
    
    // To delegate our stake, we get the current vote accounts and choose the first
    let voteAccounts = async() => await connection.getVoteAccounts();
    let voteAccount = voteAccounts.current.concat(
        voteAccounts.delinquent,
    )[0];
    let votePubkey = new web3.PublicKey(voteAccount.votePubkey);
    
    // We can then delegate our stake to the voteAccount
    let delegateTransaction = web3.StakeProgram.delegate({
        stakePubkey: stakeAccount.publicKey,
        authorizedPubkey: authorizedAccount.publicKey,
        votePubkey: votePubkey,
    });
    const trans = async() => await web3.sendAndConfirmTransaction(connection, delegateTransaction, [fromPublicKey, authorizedAccount]);
    
    // To withdraw our funds, we first have to deactivate the stake
    let deactivateTransaction = web3.StakeProgram.deactivate({
        stakePubkey: stakeAccount.publicKey,
        authorizedPubkey: authorizedAccount.publicKey,
    });
    const sendtrans = async() =>await web3.sendAndConfirmTransaction(connection, deactivateTransaction, [fromPublicKey, authorizedAccount]);
    
    // Once deactivated, we can withdraw our funds
    let withdrawTransaction = web3.StakeProgram.withdraw({
        stakePubkey: stakeAccount.publicKey,
        authorizedPubkey: authorizedAccount.publicKey,
        toPubkey: fromPublicKey.publicKey,
        lamports: stakeBalance,
    });
    
   const withdra = async() => await web3.sendAndConfirmTransaction(connection, withdrawTransaction, [fromPublicKey, authorizedAccount]);


   return (
    <div className="App"></div>
    );
}