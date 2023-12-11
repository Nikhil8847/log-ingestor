// AddLogFormComponent.jsx
// @
import { useState } from "react";
import { Form, Button, Container, Row } from "react-bootstrap";
import axios from "axios";
import { logLevels } from "../constants/constants";
// import "bootstrap/dist/css/bootstrap.min.css";
const AddLogFormComponent = () => {
  const [formData, setFormData] = useState({
    level: "",
    message: "",
    resourceId: "",
    traceId: "",
    spanId: "",
    commit: "",
    metadata: {
      parentResourceId: "",
    },
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevParams) => ({ ...prevParams, [name]: value }));
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    // If the field is inside metadata, update it accordingly
    if (name.startsWith("metadata.")) {
      setFormData((prevData) => ({
        ...prevData,
        metadata: {
          ...prevData.metadata,
          [name.split(".")[1]]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value.toLowerCase() }));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      console.log(formData);
      // Send the form data to the Node.js backend using Axios
      const response = await axios.post(
        "https://log-ingestor-backend-d6w7.onrender.com/api",
        {
          ...formData,
          timestamp: new Date(),
        }
      );

      console.log("Form submitted successfully:", response.data);
      alert("Log successfully sent for ingestion...");
      setFormData({
        level: "",
        message: "",
        resourceId: "",
        traceId: "",
        spanId: "",
        commit: "",
        metadata: {
          parentResourceId: "",
        },
      });
      // Handle the response as needed
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle errors
    }
  };

  return (
    <Container className="mt-5 bg-light rounded p-3">
      <Row lg={2} className="justify-content-center">
        <Form>
          <Form.Group controlId="formLevel">
            <Form.Label>Level</Form.Label>
            <Form.Select
              name={"level"}
              value={formData.level}
              onChange={handleInputChange}
            >
              <option value="">Select Level</option>
              {logLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="formMessage">
            <Form.Label>Message</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter message"
              name="message"
              value={formData.message}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="formResourceId">
            <Form.Label>Resource ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter resourceId"
              name="resourceId"
              value={formData.resourceId}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="formTraceId">
            <Form.Label>Trace ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter traceId"
              name="traceId"
              value={formData.traceId}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="formSpanId">
            <Form.Label>Span ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter spanId"
              name="spanId"
              value={formData.spanId}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="formCommit">
            <Form.Label>Commit</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter commit"
              name="commit"
              value={formData.commit}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="formMetadataParentResourceId">
            <Form.Label>Parent Resource ID (inside metadata)</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter parentResourceId"
              name="metadata.parentResourceId"
              value={formData.metadata.parentResourceId}
              onChange={handleChange}
            />
          </Form.Group>

          <Button
            className="mt-3 w-100"
            variant="primary"
            type="submit"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Form>
      </Row>
    </Container>
  );
};

export default AddLogFormComponent;
