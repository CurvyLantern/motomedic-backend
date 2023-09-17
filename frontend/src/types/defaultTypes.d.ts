type CompWithChildren = React.FC<{ children?: React.ReactNode }>;
type TypedObject<T, V = undefined> = {
  [key in keyof T]: V extends undefined ? T[key] : V;
};
type User = {
  id: number | string;
  name: string;
  email: string;
};
