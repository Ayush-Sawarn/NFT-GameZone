import React, {createContext, useContext,useEffect,useRef,useState} from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import {useNavigate} from 'react-router-dom';
import {ADDRESS, ABI} from '../contract';
import {createEventListeners} from './createEventListener';

const GlobalContext = createContext();

export const GlobalContextProvider = ({children}) => {
    const [walletAddress, setWalletAddress] = useState('');
    const [provider, setProvider] = useState('');
    const [contract, setContract] = useState('');
    const [showAlert, setShowAlert] = useState({status: false, type: 'info',message: ''});

    const navigate= useNavigate();
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
        if(contract){
            createEventListeners({
                navigate,contract,provider,walletAddress,setShowAlert,
            }); 
        }
    },[contract])

    useEffect(() => {
        if(showAlert.status){
            const timer = setTimeout(() => {
                setShowAlert({status: false, type: 'info',message: ''});
            },5000);
            return () => clearTimeout(timer);
        }
    },[showAlert])

    return (
        <GlobalContext.Provider value={{
            contract,walletAddress,showAlert,setShowAlert,connectWallet
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => useContext(GlobalContext);