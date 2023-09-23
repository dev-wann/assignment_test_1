import { useRef, useState } from 'react';
import { State } from '../App';
import { DataType, createData } from '../server/server';
import ModifiableListComponent from './ModifiableListComponent';

interface propsType {
  state: State;
  feedbackList: DataType[];
  archiveList: DataType[];
  updateState: (state: State) => void;
  updateFeedbackList: (input: DataType[]) => void;
  updateArchiveList: (input: DataType[]) => void;
}

export default function FeedbackListComponet(props: propsType) {
  const [isNameEmpty, setIsNameEmpty] = useState(true);
  const [isDescEmpty, setIsDescEmpty] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const nameRef = useRef('');
  const descRef = useRef('');

  const changeStateIfNeeded = (
    value: string,
    targetState: boolean,
    stateSetter: (b: boolean) => void
  ) => {
    if (value === '' && targetState === false) {
      stateSetter(true);
    } else if (targetState === true) {
      stateSetter(false);
    }
  };

  // event handlers
  function onNameInput(e: React.FormEvent) {
    const value = (e.target as HTMLInputElement).value;
    changeStateIfNeeded(value, isNameEmpty, setIsNameEmpty);
    nameRef.current = value;
  }

  function onDescInput(e: React.FormEvent) {
    const value = (e.target as HTMLInputElement).value;
    changeStateIfNeeded(value, isNameEmpty, setIsNameEmpty);
    descRef.current = value;
  }

  function onCancelClick() {
    props.updateState(State.default);
    setIsNameEmpty(true);
    setIsDescEmpty(true);
  }

  function onAddClick() {
    // validation
    if (nameRef.current === '') {
      window.alert('이름은 필수항목입니다.');
      return;
    }
    const newData: DataType = {
      name: nameRef.current,
      description: descRef.current,
      isArchived: false,
    };
    setIsNameEmpty(true);
    setIsDescEmpty(true);
    setIsLoading(true);
    props.updateState(State.default);

    createData(newData).then((res) => {
      setIsLoading(false);
      newData.id = res;
      props.updateFeedbackList([...props.feedbackList, newData]);
    });
  }

  // add 상태 시 표시할 jsx
  const addElement = (
    <li>
      <input placeholder="이름" onInput={onNameInput} />
      <input placeholder="내용" onInput={onDescInput} />
      <button onClick={onCancelClick}>취소</button>
      {isNameEmpty && isDescEmpty ? (
        <></>
      ) : (
        <button onClick={onAddClick}>추가</button>
      )}
    </li>
  );

  return (
    <ul>
      {props.feedbackList.map((data) => (
        <li key={String(data.id)}>
          <ModifiableListComponent
            data={data}
            feedbackList={props.feedbackList}
            archiveList={props.archiveList}
            updateFeedbackList={props.updateFeedbackList}
            updateArchiveList={props.updateArchiveList}
          />
        </li>
      ))}
      {props.state === State.add ? addElement : <></>}
      {isLoading ? <li>Loading...</li> : <></>}
    </ul>
  );
}
