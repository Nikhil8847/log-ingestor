// src/SingleLog.js
import { ListGroup } from "react-bootstrap";

const SingleLog = ({ log }: { log: any }) => {
  return (
    <ListGroup.Item key={log._id}>
      <p className="my-0">
        <strong className={`${getLogLevelColor(log.level)}`}>
          {log.level}:
        </strong>{" "}
        {log.message}
      </p>
      <p className="my-0">
        <strong>time</strong>: {new Date(log.timestamp).toLocaleString()}
      </p>
      <p className="my-0">
        <strong>resourceId</strong>: {log.resourceId}
      </p>
    </ListGroup.Item>
  );
};

export default SingleLog;
const getLogLevelColor = (level: string): string => {
  switch (level.toLowerCase()) {
    case "error":
      return "text-danger"; // Apply red color for error
    case "warn":
      return "text-warning"; // Apply yellow color for warning
    case "info":
      return "text-success";
    // Add more cases for other log levels
    default:
      return "text-dark"; // Default color for other levels
  }
};
