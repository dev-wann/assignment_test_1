import { useState } from 'react';
import { DataType, deleteData, modifyData } from '../server/server';

interface propType {
  data: DataType;
  feedbackList: DataType[];
  archiveList: DataType[];
  updateFeedbackList: (input: DataType[]) => void;
  updateArchiveList: (input: DataType[]) => void;
}

export default function ModifiableListComponent(props: propType) {
  const [isMod, setIsMod] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(props.data.name);
  const [desc, setDesc] = useState(props.data.description);

  // event handlers
  function onNameInput(e: React.FormEvent) {
    const value = (e.target as HTMLInputElement).value;
    setName(value);
  }

  function onDescInput(e: React.FormEvent) {
    const value = (e.target as HTMLInputElement).value;
    setDesc(value);
  }

  function onCancelClick() {
    setIsMod(false);
    setName(props.data.name);
    setDesc(props.data.description);
  }

  function onDeleteClick() {
    setIsMod(false);
    setIsLoading(true);
    deleteData(props.data.id as number).then(() => {
      props.updateFeedbackList(
        props.feedbackList.filter((item) => item.id !== props.data.id)
      );
      props.updateArchiveList([...props.archiveList, props.data]);
    });
  }

  function onModifyClick() {
    if (name !== props.data.name) {
      const response = window.confirm('이름 변경 주의 필요. 변경하시겠습니까?');
      if (!response) return;
    }
    setIsMod(false);
    setIsLoading(true);
    const newData = {
      id: props.data.id,
      name: name,
      description: desc,
      isArchived: props.data.isArchived,
    };
    modifyData(newData).then(() => {
      setIsLoading(false);
      props.updateFeedbackList(
        props.feedbackList.map((item) => {
          if (item.id === props.data.id) {
            return newData;
          }
          return item;
        })
      );
    });
  }

  // modify 상태 시 표시할 jsx
  const modifyElement = (
    <>
      <input placeholder="이름" onInput={onNameInput} value={name} />
      <input placeholder="내용" onInput={onDescInput} value={desc} />
      <button onClick={onCancelClick}>취소</button>
      <button onClick={onDeleteClick}>삭제</button>
      {name === props.data.name && desc === props.data.description ? (
        <></>
      ) : (
        <button onClick={onModifyClick}>저장</button>
      )}
    </>
  );

  return isLoading ? (
    <>Loading...</>
  ) : isMod ? (
    modifyElement
  ) : (
    <span
      onClick={() => setIsMod(true)}
    >{`${props.data.name} - ${props.data.description}`}</span>
  );
}
