import FeedbackListComponet from './components/FeedbackListComponent';
import ArchiveListComponet from './components/ArchiveListComponent';
import AddFeedbackButtonComponent from './components/AddFeedbackButtonComponent';
import { DataType, readData } from './server/server';
import { useEffect, useState } from 'react';

export enum State {
  mount,
  default,
  add,
}

function App() {
  const [state, setState] = useState(State.mount);
  const [feedbackList, setFeedbackList] = useState<DataType[]>([]);
  const [archiveList, setArchiveList] = useState<DataType[]>([]);

  // 초기 데이터 업데이트
  useEffect(() => {
    const response = readData();
    response.then((res) => {
      const feed: DataType[] = [];
      const arch: DataType[] = [];
      res.forEach((data) => {
        if (data.isArchived) {
          arch.push(data);
        } else {
          feed.push(data);
        }
      });
      setFeedbackList(feed);
      setArchiveList(arch);
      setState(State.default);
    });
  }, []);

  return (
    <div style={{ width: '800px', margin: 'auto' }}>
      <h1>피드백 관리</h1>
      {state === State.mount ? (
        <h3>Loading</h3>
      ) : (
        <FeedbackListComponet
          state={state}
          feedbackList={feedbackList}
          archiveList={archiveList}
          updateState={(input: State) => setState(input)}
          updateFeedbackList={(input: DataType[]) => setFeedbackList(input)}
          updateArchiveList={(input: DataType[]) => setArchiveList(input)}
        />
      )}
      <AddFeedbackButtonComponent
        state={state}
        feedbackList={feedbackList}
        onBtnClick={() => {
          setState(State.add);
        }}
      />
      <h1>아카이브</h1>
      {state === State.mount ? (
        <h3>Loading</h3>
      ) : (
        <ArchiveListComponet archiveList={archiveList} />
      )}
    </div>
  );
}

export default App;
