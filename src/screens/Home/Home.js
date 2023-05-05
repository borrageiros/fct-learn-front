import './Home.css';
import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, CardBody, CardTitle, CardText } from 'reactstrap';
import { Link } from 'react-router-dom';


function Home() {

  const { isAuthenticated, loginWithRedirect, getAccessTokenSilently } = useAuth0();
  const [courses, setCourses] = useState();

  // Login with home-render
  useEffect(() => {
    if (!isAuthenticated) {
      loginWithRedirect();
    }

    const fetchCourses = async () => {
      // Get token with scopes
      const accessToken = await getAccessTokenSilently({
        audience: `https://fct-netex.eu.auth0.com/api/v2/`,
      });

      const coursesResponse = await fetch(process.env.REACT_APP_API_URL + "rest/courses", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const courses = await coursesResponse.json();

      setCourses(courses)
    };

    fetchCourses();
  }, []);

  const renderCourseCard = (course) => (
    <Col xs="12" md="4" className="mb-4">
      <Link to={`/course/${course._id}`} className="course-card-link">
        <Card className="text-center course-card">
          <CardBody>
            <CardTitle tag="h5" className="mb-3">{course.title}</CardTitle>
            <CardText>{course.description}</CardText>
            {course.image && <img className='course-card-image' src={course.image} alt="" />}
          </CardBody>
        </Card>
      </Link>
    </Col>
  );
  

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
          </Col>          
          <Col xs="12" md="4">
            <Link to="/activities/create">
              <Button className='button' color="primary" size="lg" block>
                Create activity
              </Button>
            </Link>
          </Col>
        </Row>
        <br/><br/><br/>
        <Row>
          {courses && courses.map(course => renderCourseCard(course))}
        </Row>
      </Container>
    </div>
  );
}

export default Home;
