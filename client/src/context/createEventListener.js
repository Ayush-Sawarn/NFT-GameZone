import {ethers} from 'ethers';
import {ABI} from '../contract';

const AddNewEvent=(eventFilter,provider,cb)=> {  //cb-- callback
    provider.removeListener(eventFilter);  // this removes the existing listener

    provider.on(eventFilter,(logs =>{
        const parsedLog= (new ethers.utils.Interface(ABI)).parseLog(logs);

        cb(parsedLog);
    }));

}

export const createEventListeners= ({navigate,contract,provider,walletAddress,setShowAlert})=>{
    const newPlayerEventFilter= contract.filters.NewPlayer();

    AddNewEvent(newPlayerEventFilter,provider,({args})=>{
        console.log("New Player Created!",args);

        if(walletAddress == args.owner){
            setShowAlert({status: true, type: 'success', message: "Player registered successfully!"});
        }
        });
};

