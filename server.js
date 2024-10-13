import express from 'express';
import fs from 'fs';
import session from 'express-session';
import dotenv from 'dotenv';
import { body, validationResult } from 'express-validator'; 
import TonWeb from "tonweb";
import cors from 'cors';
//import { WalletV4ContractR2 } from 'tonweb/dist/types/contract/wallet/v4/wallet-v4-contract-r2';

dotenv.config();


const BN = TonWeb.utils.BN;
const NODE_API_URL = 'https://toncenter.com/api/v2/jsonRPC';
//const INDEX_API_URL = 'https://toncenter.com/api/index/';
const tonweb = new TonWeb(new TonWeb.HttpProvider(NODE_API_URL, {apiKey: process.env.TONCENTER_API_KEY}));
const masterKeyPair = TonWeb.utils.nacl.sign.keyPair.fromSecretKey(TonWeb.utils.hexToBytes(process.env.JETTON_MASTER_KEY));

const getJettonWallet = () => {
    //const keyPair = nacl.box.keyPair.fromSecretKey(process.env.TOKEN_MASTER_KEY);
    const WalletClass = tonweb.wallet.all['v4R2'];
    const wallet = new WalletClass(tonweb.provider, {
        publicKey:  masterKeyPair.publicKey,
        wc: 0
    });
    //const wallet = tonweb.wallet.create({publicKey: masterKeyPair.publicKey, WalletV4ContractR2});
    return wallet;
}
const getWallet = (address) => {
    const wallet = tonweb.wallet.create({address: address});
    return wallet;
} 

const sendJettons = async (winnerAddress) => {
    const jettonWalletAddress =  process.env.JETTON_WALLET_ADDRESS;
    const jettonWallet = new TonWeb.token.jetton.JettonWallet(tonweb.provider, {address: jettonWalletAddress});
    const wallet = getTokenWallet();
    const seqno = await wallet.methods.seqno().call() || 0

    const transfer = await wallet.methods.transfer({
        secretKey: masterKeyPair.secretKey,
        toAddress: jettonWalletAddress,
        amount: 0,
        seqno: seqno,
        //sendMode: 128,
        payload: await jettonWallet.createTransferBody({
            queryId: seqno, 
            jettonAmount: process.env.REWARD_AMOUNT, // jetton amount in units
            toAddress: new TonWeb.utils.Address(winnerAddress),
            responseAddress: new TonWeb.utils.Address(winnerAddress)
        })
    });

    await transfer.send();
}



const app = express();
const port = 3333;

// Use built-in JSON parser
app.use(express.json());
// Use CORS middleware and allow any origin
app.use(cors({
    origin: '*', // Allow any origin
    credentials: true, // Allow credentials (cookies) to be sent
  }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET, 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// GET: /question/get
app.get('/question/get', async (req, res) => {
  try {
    const data = await fs.promises.readFile('questions.json', 'utf8');
    const questions = JSON.parse(data);
    res.json(questions);
  } catch (err) {
    console.error('Error processing request:', err);
    res.status(500).send('Server error');
  }
});

// POST: /question/answer
app.post('/question/answer',
    // Validation middleware
    body('answers').isArray().withMessage('answers must be an array'),
    body('answers.*').isObject().withMessage('Each item in answers must be an object'),
    body('answers.*.question').isString().withMessage('question must be a string'),
    body('answers.*.answer').isString().withMessage('answer must be a string'),
    async (req, res) => {
      // Handle validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.error('Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { answers } = req.body; 
  

  
      console.log('Received answers:', answers);
  
      res.send('Answers received');
    }
  );
  

// GET: /session/start
app.get('/session/start', (req, res) => {
  const wallet = req.query.wallet || null;
  // Save wallet in session if provided
  if (wallet) {
    req.session.wallet = wallet;
  }
  // Initialize session if this is the first request
  if (!req.session.userId) {
    req.session.userId = generateUniqueId();
  }
 
  res.json({ session: req.session.userId });
});

// Function to generate a unique user identifier
function generateUniqueId() {
  return Math.random().toString(36).substr(2, 9);
}


 app.listen(port, () => {
   console.log(`Server is running at http://localhost:${port}`);
});
