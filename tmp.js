
const wallet = getWallet("UQDREvsHU0QCmGAx7F6Znb1vqrcOg-j5jk_Nbj20OrTZJzz5");

const jetton = new TonWeb.token.jetton.JettonMinter(tonweb.provider, {address: process.env.JETTON_WALLET_ADDRESS});
const jettonWalletAddress = await jetton.getJettonWalletAddress(wallet.address);
console.log(jettonWalletAddress.toString(true, true, false)); 
const jettonWallet = new TonWeb.token.jetton.JettonWallet(tonweb.provider, {address: jettonWalletAddress});

const jettonBalance = (await jettonWallet.getData()).balance; 
console.log(jettonBalance.toString());



sendJettons('UQAwTdE7fyU9udU4Z4qCIYWbKIV4MJ-xrmWQg0urttEsrptW');