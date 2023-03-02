const { Blockchain, Transaction } = require('./Blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');// You can use any elliptic curve you want

const myKey = ec.keyFromPrivate('7c016cfc1b53313f8b8b7e8fe153457dedb92d12eafa392972917797874d17a4')
const myWalletAddress = myKey.getPublic('hex');

const minerKey= ec.keyFromPrivate('b707a3520b28f667fd63689e865de0321ececddf97823e46c794d28d20c97910')
const minerWalletaddress = minerKey.getPublic('hex')

let vcoin = new Blockchain();
const tx1 = new Transaction(myWalletAddress , 'public key ',10);
tx1.signTransaction(myKey);

vcoin.addTransaction(tx1);

const tx2 = new Transaction(myWalletAddress , 'public key ',20);
tx2.signTransaction(myKey);
vcoin.addTransaction(tx2);
const tx3 = new Transaction(myWalletAddress , minerWalletaddress,20);
tx3.signTransaction(myKey);
vcoin.addTransaction(tx3);

console.log("start miner")
vcoin.minePendingTransactions(minerWalletaddress)

console.log("balance of vivek : ",vcoin.getBalanceOfAddress(myWalletAddress))
console.log("balance of miner : ",vcoin.getBalanceOfAddress(minerWalletaddress))
console.log("Validataion result : ", vcoin.validateChain())