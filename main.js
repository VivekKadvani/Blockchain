const { Blockchain, Transaction } = require('./Blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');// You can use any elliptic curve you want

const myKey = ec.keyFromPrivate('7c016cfc1b53313f8b8b7e8fe153457dedb92d12eafa392972917797874d17a4')
const myWalletAddress = myKey.getPublic('hex');


let vcoin = new Blockchain();
const tx1 = new Transaction(myWalletAddress , 'public key ',10);
tx1.signTransaction(myKey);
vcoin.addTransaction(tx1);
const tx2 = new Transaction(myWalletAddress , 'public key ',20);
tx2.signTransaction(myKey);
vcoin.addTransaction(tx2);

console.log("start miner")
vcoin.minePendingTransactions(myWalletAddress)

console.log("balance of vivek : ",vcoin.getBalanceOfAddress(myWalletAddress))
console.log("Validataion result : ", vcoin.validateChain())