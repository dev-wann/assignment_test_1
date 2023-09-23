import { State } from '../App';
import { DataType } from '../server/server';

interface propsType {
  state: State;
  feedbackList: DataType[];
  onBtnClick: () => void;
}

export default function AddFeedbackButtonComponent(props: propsType) {
  return props.state !== State.add ? (
    <button onClick={props.onBtnClick}>카테고리 추가</button>
  ) : (
    <></>
  );
}
