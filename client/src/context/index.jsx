import React, {createContext, useContext,useEffect,useRef,useState} from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import {useNavigate} from 'react-router-dom';
import {ADDRESS, ABI} from '../contract';
import {createEventListeners} from './createEventListener';
import { GetParams } from '../utils/onboard';

const GlobalContext = createContext();

export const GlobalContextProvider = ({children}) => {
    const [walletAddress, setWalletAddress] = useState('');
    const [provider, setProvider] = useState('');
    const [contract, setContract] = useState('');
    const [showAlert, setShowAlert] = useState({status: false, type: 'info',message: ''});
    const [battleName, setBattleName] = useState('');
    const [gameData, setGameData] = useState({players: [], pendingBattles: [], activeBattle: null});
    const [updateGameData, setUpdateGameData]= useState(0);
    const [battleGround, setBattleGround]= useState('bg-astral');
    const [step,setStep]= useState(1);
    const [errorMessage, setErrorMessage]= useState('');


    const navigate= useNavigate();
        
    useEffect(()=>{
        const isBattleground= localStorage.getItem('battleground');
        if(isBattleground){
            setBattleGround(isBattleground);
        }
        else{
            localStorage.setItem('battleground',battleGround)
        }
    },[])

    const updateCurrentWalletAddress = async () => {
        try {
            await connectWallet();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(()=>{
        const resetParams= async()=>{
            const currentStep= await GetParams();

            setStep(currentStep.step);
        }
        resetParams();
        window?.ethereum?.on('chainChanged',()=>resetParams());
        window?.ethereum?.on('accountsChanged',()=>resetParams());
    },[])
   
    const connectWallet = async () => {
        try {
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            setWalletAddress(address);
            const newContract = new ethers.Contract(ADDRESS, ABI, signer);
            setContract(newContract);
            setProvider(provider);
        } catch (err) {
            setShowAlert({status: true, type: 'error', message: 'Failed to connect wallet: ' + err.message});
        }
    };

    useEffect(()=>{
        if(step!== -1 && contract){
            createEventListeners({
                navigate,contract,provider,walletAddress,setShowAlert,setUpdateGameData,
            }); 
        }
    },[contract],step)

    useEffect(() => {
        if(showAlert?.status){
            const timer = setTimeout(() => {
                setShowAlert({status: false, type: 'info',message: ''})},[5000])
            return () => clearTimeout(timer);
        }
    },[showAlert])

    // Handle error messages

    useEffect(()=>{
        if(errorMessage){
            const parsedErrorMessage= errorMessage?.reason?.slice('execution reverted: '.length).slice(0,-1);
            if(parsedErrorMessage){
                setShowAlert({
                    status: true,
                    type: 'failure',
                    message: parsedErrorMessage
                })
            }
        }
    },[errorMessage])

    useEffect(()=>{
        const fetchGameData= async()=>{
            const fetchedBattles= await contract.getAllBattles(); // returns an array of all the battles
                                                                     // first element will always be 0 when we fetch data from the contract

            const pendingBattles= fetchedBattles.filter((battle)=> battle.battleStatus ===0);
            let activeBattle= null;

            fetchedBattles.forEach((battle)=>{
                if(battle.players.find((player)=> player.toLowerCase() === walletAddress.toLowerCase())){
                    if(battle.winner.startsWith('0x00')){  // this means the battle is still ongoing
                        activeBattle= battle;
                    }
                }
            })
            setGameData({pendingBattles: pendingBattles.slice(1), activeBattle});
        }
        if(contract) fetchGameData();
    },[contract,updateGameData])

    return (
        <GlobalContext.Provider value={{
            contract,walletAddress,showAlert,setShowAlert,connectWallet,updateCurrentWalletAddress,battleName,setBattleName,gameData,battleGround,setBattleGround,errorMessage,setErrorMessage
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => useContext(GlobalContext);