import {ethers} from 'ethers';
import {ABI} from '../contract';

const AddNewEvent=(eventFilter,provider,cb)=> {  //cb-- callback
    provider.removeListener(eventFilter);  // this removes the existing listener

    provider.on(eventFilter,(logs =>{
        const parsedLog= (new ethers.utils.Interface(ABI)).parseLog(logs);

        cb(parsedLog);
    }));

}

export const createEventListeners= ({navigate,contract,provider,walletAddress,setShowAlert,setUpdateGameData})=>{
    const newPlayerEventFilter= contract.filters.NewPlayer();

    AddNewEvent(newPlayerEventFilter,provider,({args})=>{
        console.log("New Player Created!",args);

        if(walletAddress == args.owner){
            setShowAlert({status: true, type: 'success', message: "Player registered successfully!"});
        }
        });

    const newBattleEventFilter= contract.filters.NewBattle();
// adding an event listener which navigates the user to join the battle page 
    AddNewEvent(newBattleEventFilter,provider,({args})=>{
        console.log("New Battle Started", args, walletAddress); 

        if(walletAddress.toLowerCase() === args.player1.toLowerCase() || walletAddress.toLowerCase() === args.player2.toLowerCase()){
            navigate(`/battle/${args.battleName}`);
        }
        setUpdateGameData((prevUpdateGameData)=> prevUpdateGameData+1);

    });
};

