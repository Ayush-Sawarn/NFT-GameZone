import React,{useEffect,useState} from 'react';
import {useNavigate} from 'react-router-dom';
import styles from '../styles';
import {useGlobalContext} from '../context';
import {PageHOC,CustomInput,CustomButton,GameLoads} from '../components';

const createBattle = () => {
  const {contract,battleName,setBattleName, showAlert, setShowAlert, gameData} = useGlobalContext();
  const [waitBattle,setWaitBattle] = useState(false);
  const navigate= useNavigate();

  useEffect(()=>{
    if(gameData?.activeBattle?.battleStatus === 0){
      setWaitBattle(true);
    }
  },[gameData])

  const handleClick= async()=>{
    if (!contract) {
      setShowAlert({
        status: true,
        type: "failure",
        message: "Please connect your wallet to create a battle",
      });
      return;
    }

    if(!battleName || !battleName.trim())return null;

    try{
      await contract.createBattle(battleName);
      setWaitBattle(true);
    } catch (error){
      console.log(error);
    }
  }
  return (
    <>
    {waitBattle && <GameLoads/>}
    <div className="flex flex-col mb-5">
      <CustomInput 
      label="Battle"
      placeholder="Enter Battle Name"
      value={battleName}
      handleValueChange={setBattleName}
      />

      <CustomButton
      title="Create Battle"
      handleClick={handleClick}
      restType="mt-6"
      />
    
    </div>
    <p className={styles.infoText} onClick={()=>navigate('/join-battle')}>Or join already existing Battles</p>
    </>
  )

};

export default PageHOC(createBattle,
  <>Create a new Battle</>,
  <>Create your own battle and invite your friends to join <br/></>
);