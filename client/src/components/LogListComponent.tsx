import { ListGroup } from "react-bootstrap";
import SingleLog from "./SingleLogComponent";

const LogListComponent = ({ logs }: { logs: any[] }) => {
  console.log(logs.length);

  return (
    <ListGroup>
      {logs.map((log) => (
        <SingleLog key={log._id} log={log} />
      ))}
    </ListGroup>
  );
};

export default LogListComponent;
