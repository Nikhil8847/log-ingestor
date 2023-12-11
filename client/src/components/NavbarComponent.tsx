import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
const NavbarComponent = () => {
  return (
    <>
      <Navbar sticky="top" bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand as={Link} to={"add-log"}>
            Navbar
          </Navbar.Brand>
          <Nav className="me-auto">
            {/* <Link href="#home">Add Log</Link> */}
            <Nav.Link as={Link} to={"add-log"}>
              Add Log
            </Nav.Link>
            <Nav.Link as={Link} to={"logs"}>
              Logs
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default NavbarComponent;
