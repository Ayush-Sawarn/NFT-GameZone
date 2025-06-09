import React, {createContext, useContext,useEffect,useRef,useState} from 'react';
import { ethers } from 'ethers';
import web3Modal from 'web3modal';
import {useNavigate} from 'react-router-dom';
import {ADDRESS, ABI} from '../contract';

const GlobalContext = createContext();

export const GlobalContextProvider = ({children}) => {
    const [walletAddress, setWalletAddress] = useState('');
    const [provider, setProvider] = useState('');
    const [contract, setContract] = useState('');
    const [showAlert, setShowAlert] = useState({status: false, type: 'info',message: ''});

    const updateWalletAddress = async () => {
        const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
        if(accounts) setWalletAddress(accounts[0]);
    }

    useEffect(() => {
        updateWalletAddress();
        window.ethereum.on('accountsChanged', updateWalletAddress);
    }, []);

    useEffect(() => {
        const setSmartContractAndProvider = async () => {
            const web3Modal = new web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const newContract = new ethers.Contract(ADDRESS, ABI, signer);

            setContract(newContract);
            setProvider(provider);
        }
        setSmartContractAndProvider();
    },[])

    useEffect(() => {
        if(showAlert.status){
            const timer = setTimeout(() => {
                setShowAlert({status: false, type: 'info',message: ''});
            },[5000]);
            return () => clearTimeout(timer);
        }
    },[showAlert])

    return (
        <GlobalContext.Provider value={{
            contract,walletAddress,showAlert,setShowAlert
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => useContext(GlobalContext);