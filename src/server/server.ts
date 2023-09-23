function* IdGenerator() {
  let id = 0;
  while (true) {
    yield id;
    id++;
  }
}
const idGenerator = IdGenerator();
function getNewId() {
  return Number(idGenerator.next().value);
}

let data: DataType[] = [
  { id: getNewId(), name: 'a', description: 'aa', isArchived: false },
  { id: getNewId(), name: 'b', description: 'bb', isArchived: false },
  { id: getNewId(), name: 'c', description: 'cc', isArchived: true },
];

export interface DataType {
  id?: number;
  name: string;
  description: string;
  isArchived: boolean;
}

export async function readData() {
  await waitSecond();
  return data;
}

export async function createData(input: DataType) {
  await waitSecond();
  let newId = getNewId();
  data.push({ ...input, id: newId });
  return newId;
}

export async function deleteData(deleteId: number) {
  await waitSecond();
  data = data.filter((item) => item.id !== deleteId);
}

export async function modifyData(input: DataType) {
  await waitSecond();
  data = data.map((item) => {
    if (item.id === input.id) {
      return input;
    }
    return item;
  });
}

function waitSecond() {
  const promise = new Promise((res) => {
    setTimeout(() => {
      res(0);
    }, 1000);
  });
  return promise;
}
