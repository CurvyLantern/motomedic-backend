import { useRouteError } from "react-router-dom";

const RootErrorBoundary = () => {
  const error = useRouteError();
  if (error) {
    console.log(error, " boundary ");
    return <div>{JSON.stringify(error)}</div>;
  }

  throw error;
};

export default RootErrorBoundary;
