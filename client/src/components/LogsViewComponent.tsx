// src/LogsViewComponent.js
import { useState, useEffect } from "react";
import axios from "axios";
import { Container, Spinner, Row, Col, Form, Button } from "react-bootstrap";
import LogListComponent from "./LogListComponent";
import { logLevels } from "../constants/constants";

// eslint-disable
function LogsViewComponent() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [queryParams, setQueryParams] = useState({
    level: "",
    resourceId: "",
    start: "",
    end: "",
    traceId: "",
    spanId: "",
    commit: "",
    parentResourceId: "",
    search: "",
  });
  const checkCorrectDate = (start: string, end: string) => {
    if (!(start && end)) {
      return true;
    }
    const startDate = new Date(start);
    const endDate = new Date(end);
    return startDate < endDate;
  };
  useEffect(() => {
    // Load initial logs on component mount
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      if (
        (!queryParams.start && queryParams.end) ||
        (!queryParams.end && queryParams.start)
      ) {
        alert("Please enter both start and end");
        return;
      } else if (!checkCorrectDate(queryParams.start, queryParams.end)) {
        alert("Please select a valid timestamp");
        return;
      }
      // eslint-disable-next-line no-unused-vars
      const nonEmptyQueryparams = Object.entries(queryParams)
        .filter(([, value]) => value.length > 0)
        .reduce((acc: any, [key, value]) => {
          acc[key] = value.toLowerCase();
          return acc;
        }, {});
      console.log(nonEmptyQueryparams);
      const response = await axios.get(
        "https://log-ingestor-backend-d6w7.onrender.com/api",
        {
          params: nonEmptyQueryparams,
        }
      );
      console.log(response);
      setLogs(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setQueryParams((prevParams) => ({ ...prevParams, [name]: value }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    fetchLogs();
  };

  const handleSearchKeyDown = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      fetchLogs();
    }
  };
  return (
    <div className="vh-100">
      <Container fluid>
        <h1 className="mb-4 mt-2 text-center">Log Viewer</h1>
        <Row className="flex-grow-1">
          {/* Sidebar */}
          <Col md={4} className=" p-4 position-fixed h-100 ">
            <Form onSubmit={handleSubmit}>
              {Object.entries(queryParams).map(
                ([key, value]) =>
                  key !== "search" && (
                    <Form.Group className="m-2" key={key} controlId={key}>
                      <Form.Label className="text-capitalize">
                        {"  "}
                        {key}
                      </Form.Label>

                      {key === "level" ? (
                        <Form.Select
                          name={key}
                          value={value}
                          onChange={handleInputChange}
                        >
                          <option value="">Select Level</option>
                          {logLevels.map((level) => (
                            <option key={level} value={level}>
                              {level}
                            </option>
                          ))}
                        </Form.Select>
                      ) : (
                        <Form.Control
                          type={
                            key === "start" || key === "end"
                              ? "datetime-local"
                              : "text"
                          }
                          name={key}
                          value={value}
                          onChange={handleInputChange}
                        />
                      )}
                    </Form.Group>
                  )
              )}
              <Button className="mt-3 w-100" variant="primary" type="submit">
                Fetch Logs
              </Button>
            </Form>
            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <p>
                <strong>NOTE:</strong> There might be delay in viewing the
                updated cache values, As the cache is recached every 2 minutes
              </p>
            </div>
          </Col>

          {/* Logs */}
          <Col
            md={{ span: 8, offset: 4 }}
            className="p-4 bg-light overflow-auto vh-75"
          >
            <Row className="mb-3 sticky-top">
              <Col className="p-4">
                <Form>
                  <Form.Group controlId="search" className="mb-0">
                    <Form.Label>Search</Form.Label>
                    <Form.Control
                      type="text"
                      name="search"
                      value={queryParams.search}
                      onChange={handleInputChange}
                      onKeyDown={handleSearchKeyDown}
                    />
                  </Form.Group>
                </Form>
              </Col>
            </Row>

            {loading ? (
              <div className="d-flex justify-content-center h-100">
                <Spinner
                  className="justify-content-center"
                  animation="border"
                />
              </div>
            ) : logs.length > 0 ? (
              <LogListComponent logs={logs} />
            ) : (
              <h1 className="text-center">No Logs</h1>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default LogsViewComponent;
