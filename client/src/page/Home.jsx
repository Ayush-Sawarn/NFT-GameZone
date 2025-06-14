import React, {useEffect,useState} from 'react';
import {PageHOC, CustomInput, CustomButton} from '../components';
import {useNavigate} from 'react-router-dom';
import {useGlobalContext} from '../context';

const Home = () => {
  const {contract, walletAddress, setShowAlert, connectWallet} = useGlobalContext();
  const [playerName, setPlayerName] = useState('');

  const handleClick = async () => {
    try {
      if (!walletAddress) {
        await connectWallet();
        setShowAlert({ status: true, type: "info", message: "Wallet connected! Now click Register again." });
        return;
      }
      if (!contract || typeof contract.isPlayer !== 'function') {
        setShowAlert({ status: true, type: "error", message: "Contract not ready. Please try again in a moment." });
        return;
      }
      const playerExists = await contract.isPlayer(walletAddress);
      if (!playerExists) {
        await contract.registerPlayer(playerName, playerName);
        setShowAlert({ status: true, type: "info", message: `${playerName} registered successfully` });
      }
    } catch (error) {
      setShowAlert({ status: true, type: "failure", message: error.message });
    }
  };
  const navigate= useNavigate();
  useEffect(()=>{
    const checkForPlayerToken= async()=>{
      const playerExists= await contract.isPlayer(walletAddress);
      const playerTokenExists= await contract.isPlayerToken(walletAddress);

      console.log(playerExists,playerTokenExists);

      if(playerExists && playerTokenExists){
        navigate('/create-battle')
    }
  }
    if(contract){
      checkForPlayerToken();
    }
  },[contract]);
  return (
    <>
      {!walletAddress && (
        <button className="flex flex-col" onClick={connectWallet}>Connect Wallet</button>
      )}
      <div className="flex flex-col">
        <CustomInput 
        Label="Name"
        placeholder="Enter your name"
        value={playerName}
        handleValueChange={setPlayerName}
        
        />
        <CustomButton
        title="Register"
        handleClick={handleClick}
        restType="mt-6"
        />
      </div>
    </>
  )
};

export default PageHOC(Home,
  <>Welcome to Avax Gods <br /> a Web3 NFT Card Battle Game</>,
  <>Connect your wallet to get started <br/></>
);