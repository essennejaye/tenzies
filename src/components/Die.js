export default function Die(props) {
  const styles = {
    backgroundColor: props.isHeld ? '#59e391' : 'white',
  };
  const pipElements = parseInt(props.value);
  const pips = Array(pipElements)
    .fill(0)
    .map((_, index) => <span key={index} className='pip'></span>);
  return (
    <div onClick={props.holdDice} className='die-face' style={styles}>
      {pips}
    </div>
  );
}
