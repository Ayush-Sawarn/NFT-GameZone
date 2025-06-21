import React from 'react';
import styles from '../styles';
import {useNavigate} from 'react-router-dom';
import CustomButton from './CustomButton';
import {useGlobalContext} from '../context';
import {player01,player02} from '../assets';

const GameLoads = () => {
    const {walletAddress} = useGlobalContext();
    const navigate= useNavigate();
    return (
        <div className="fixed inset-0 w-screen h-screen bg-black/40 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
            <div className="mb-8">
                <CustomButton
                title='Choose Battle Ground' 
                handleClick={()=>navigate('/battleground')}
                restType='mt-6'
                />
            </div>

            <div className= {`flex-1 ${styles.flexCenter} flex-col`}>
            <h1 className={`${styles.headText} text-center`}>Waiting for a <br /> worthy opponent ...</h1>
            <p className={styles.gameLoadText}>ProTip: While you're waiting, choose your preferred battle ground</p>

            <div className={styles.gameLoadPlayersBox}>
                <div className={`${styles.flexCenter} flex-col`}>
                    <img src={player01} className={styles.gameLoadPlayerImg}/>
                    <p className={styles.gameLoadPlayerText}>{walletAddress.slice(0,30)}</p>
                </div>

                <h2 className={styles.gameLoadVS}>Vs</h2>

                <div className={`${styles.flexCenter} flex-col`}>
                    <img src={player02} className={styles.gameLoadPlayerImg}/>
                    <p className={styles.gameLoadPlayerText}>???????????????</p>
                </div>

            </div>
            </div>
        </div>
    )
}

export default GameLoads;