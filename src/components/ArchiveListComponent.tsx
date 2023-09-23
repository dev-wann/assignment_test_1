import { DataType } from '../server/server';

interface propsType {
  archiveList: DataType[];
}

export default function ArchiveListComponet(props: propsType) {
  return (
    <ul>
      {props.archiveList.map((data) => (
        <li key={String(data.id)}>{`${data.name} - ${data.description}`}</li>
      ))}
    </ul>
  );
}
