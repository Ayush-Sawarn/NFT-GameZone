import React from "react"
import styles from '../styles'

const ActionButton=({imgUrl,handleClick,restTypes})=>{
    return (

        <div className={`w-16 h-16 rounded-full  bg-opacity-5 backdrop-blur-md flex items-center justify-center shadow-lg ${restTypes}`} onClick={handleClick}>
        <img src={imgUrl} alt="action_img" className={styles.gameMoveIcon}/>
    </div>
    )
}

export default ActionButton