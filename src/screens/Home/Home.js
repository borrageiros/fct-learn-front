import './Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle, CardText } from 'reactstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';


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

  
  const deleteCourse = async (id) => {
    try {
      const accessToken = await getAccessTokenSilently({
        audience: 'https://fct-netex.eu.auth0.com/api/v2/',
      });
  
      await axios.delete(process.env.REACT_APP_API_URL + "rest/courses/" + id, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      setCourses(courses.filter(course => course._id !== id));
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div className='App'>
      <br/><br/><br/>
      <Container>
        <Row>
          {courses && courses.map(course => (
              <Col xs="12" md="4" className="mb-4" key={course._id}>
                <Link to={`/course/${course._id}`} className="course-card-link">
                  <Card className="text-center course-card">
                    <CardBody>
                      <CardTitle tag="h5" className="mb-3">{course.title}</CardTitle>
                      <CardText>{course.description}</CardText>
                      {course.image && <img className='course-card-image' src={course.image} alt="" />}
                    </CardBody>
                  </Card>
                </Link>
                {/* BUTTONS */}
                <div className='text-center'>
                  <Link to={`/course/edit/${course._id}`} className="pencil-link">
                    <FontAwesomeIcon icon={faPencilAlt} />
                  </Link>
                  <FontAwesomeIcon
                    icon={faTrashCan}
                    className="delete-icon"
                    onClick={() => deleteCourse(course._id)}
                  />
                </div>
              </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default Home;
