import React, {useEffect} from 'react';
import {CustomButton,PageHOC} from '../components';
import {useNavigate} from 'react-router-dom';
import {useGlobalContext} from '../context';
import styles from '../styles';

const JoinBattles= ()=>{
    const navigate= useNavigate();
    return(
        <>
        <h2 className={styles.joinHeadText}>Available Battles:</h2>
        <p className={styles.infoText} onClick={()=>navigate('/create-battle')}>Or create a new battle</p>
        </>
    )
}

export default PageHOC(
    JoinBattles,
    <>Join <br /> Battles</>,
    <>Join already existing Battles</>
)