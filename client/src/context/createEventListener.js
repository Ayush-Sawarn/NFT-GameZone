import {ethers} from 'ethers';
import {ABI} from '../contract';

const AddNewEvent=(eventFilter,provider,cb)=> {  //cb-- callback
    provider.removeListener(eventFilter);  // this removes the existing listener

    provider.on(eventFilter,(logs =>{
        const parsedLog= (new ethers.utils.Interface(ABI)).parseLog(logs);

        cb(parsedLog);
    }));

}

export default AddNewEvent;