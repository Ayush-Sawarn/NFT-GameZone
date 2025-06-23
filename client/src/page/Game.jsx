import { PlayerInfo, Card, ActionButton, GameInfo } from '../components';
import { useGlobalContext } from '../context';

const Game = () => {
  const { contract, gameData, walletAddress, showAlert, setshowAlert, battleGround, setBattleGround, player1Ref, player2Ref } = useGlobalContext();
  const [showGameInfo, setShowGameInfo] = useState(false);
  const [playerOne, setPlayerOne] = useState({});
  const [playerTwo, setPlayerTwo] = useState({});
  const { battleName } = useParams();

  useEffect(() => {
    const getPlayerInfo = async () => {
      try {
        if (gameData.activeBattle) {
          const player01 = await contract.getPlayerInfo(gameData.activeBattle.players[0]);
          const player02 = await contract.getPlayerInfo(gameData.activeBattle.players[1]);

          if (gameData.activeBattle.players[0].toLowerCase() === walletAddress.toLowerCase()) {
            setPlayerOne(player01);
            setPlayerTwo(player02);
          } else {
            setPlayerOne(player02);
            setPlayerTwo(player01);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (contract && gameData.activeBattle) getPlayerInfo();
  }, [contract, gameData, walletAddress]);

  return (
    <div ref={battleGround} className={`${styles.gameContainer} ${battleGround}`}>
      {showAlert?.status && <Alert type={showAlert.type} message={showAlert.message} />}

      <div className={styles.gameInfoIconBox} onClick={() => setShowGameInfo(true)}>
        <img src={alertIcon} alt="game info" className={styles.gameInfoIconImg} />
      </div>

      <GameInfo showGameInfo={showGameInfo} setShowGameInfo={setShowGameInfo} />

      <div className={`${styles.flexBetween} ${styles.gameBattlegroundContainer}`}>
        <PlayerInfo player={playerOne} playerIcon={player01Icon} mt />
        <PlayerInfo player={playerTwo} playerIcon={player02Icon} />
      </div>

      <div className={`flex-1 ${styles.flexCenter} pb-12`}>
        Card
      </div>
    </div>
  );
};

export default Game; 