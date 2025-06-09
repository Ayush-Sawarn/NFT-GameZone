import React, {useState} from 'react';
import {PageHOC, CustomInput, CustomButton} from '../components';

import {useGlobalContext} from '../context';

const Home = () => {
  const {contract, walletAddress,setShowAlert} = useGlobalContext();
  const [playerName, setPlayerName] = useState('');

  const handleClick = async () => {
    try{
      const playerExists=await contract.isPlayer(walletAddress);
      if(!playerExists){
        await contract.registerPlayer(playerName,playerName);

        setShowAlert({status: 'true', type: 'info', message: `${playerName} registered successfully`});
    }
  }
  catch(error){
    setShowAlert({status: 'true', type: 'error', message: error.message});
    }
  }
  return (
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
  )
};

export default PageHOC(Home,
  <>Welcome to Avax Gods <br /> a Web3 NFT Card Battle Game</>,
  <>Connect your wallet to get started <br/></>
);