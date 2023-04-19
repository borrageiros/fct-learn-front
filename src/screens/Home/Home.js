import './Home.css';
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';


function Home() {

  const { isAuthenticated, loginWithRedirect } = useAuth0();

  // Login with home-render
  useEffect(() => {
    if (!isAuthenticated) {
      loginWithRedirect();
    }
  }, []);

  return (
    <div className='App'>
      <br/><br/><br/>
      <Container>
        <Row>
          <Col xs="12" md="4">
            <Link to="/profile">
              <Button className='button' color="primary" size="lg" block>
                Profile
              </Button>
            </Link>
          </Col>
          <Col xs="12" md="4">
            <Link to="/activities">
              <Button className='button' color="primary" size="lg" block>
                Activities
              </Button>
            </Link>
          </Col>          <Col xs="12" md="4">
            <Link to="/activities/create">
              <Button className='button' color="primary" size="lg" block>
                Create activitie
              </Button>
            </Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Home;
