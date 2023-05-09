import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './CourseEditOrCreate.css';
import { useAuth0 } from '@auth0/auth0-react';
import { Card, CardBody, CardHeader, Col, Container, Form, FormGroup, Input, Label, Row, Button } from 'reactstrap';


function CourseEditOrCreate() {
    const { action, id } = useParams();
    const { getAccessTokenSilently } = useAuth0();
    const [course, setCourse] = useState(null);
    const navigate = useNavigate();

    const fetchCourse = async () => {
        const accessToken = await getAccessTokenSilently({
            audience: `https://fct-netex.eu.auth0.com/api/v2/`,
        });
        const courseResponse = await fetch(process.env.REACT_APP_API_URL + "rest/courses/"+id, {
            headers: {
            Authorization: `Bearer ${accessToken}`,
            },
        });
        const course = await courseResponse.json();    
        setCourse(course)
    };
    
    useEffect(() => {
        if (action !== "edit" && action !== "create"){window.location.assign("/")}
        if (action === "edit"){
            fetchCourse()
        }
    }, []);


    const handleSubmit = async (event) => {
        event.preventDefault();
        if (action === "create"){
            try {
              const accessToken = await getAccessTokenSilently({
                audience: "https://fct-netex.eu.auth0.com/api/v2/",
              });
              await fetch(process.env.REACT_APP_API_URL + "rest/courses", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(course),
              });
              navigate("/")
            } catch (error) {
              console.error(error);
            }
        }else if (action === "edit"){
            try {
                const accessToken = await getAccessTokenSilently({
                  audience: "https://fct-netex.eu.auth0.com/api/v2/",
                });
                await fetch(process.env.REACT_APP_API_URL + "rest/courses/"+id, {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                  },
                  body: JSON.stringify(course),
                });
                navigate("/")
              } catch (error) {
                console.error(error);
              }
        }
      };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCourse((prevCourse) => ({
          ...prevCourse,
          [name]: value,
        }));
      };

    return (
        <div className="cardFormulario">

            <Container className="mt-4">
            <Row>
                <Col>
                <Card>
                    <CardHeader className='editTitle'>{action.charAt(0).toUpperCase()+action.slice(1) + " course"}</CardHeader>
                    <CardBody>
                    <Form onSubmit={handleSubmit}>
                        <FormGroup>
                        <Label for="title">Title: <span className="requiredEdit">*</span></Label>
                        <Input type="text" id="title" name="title" value={course && course.title || ""} onChange={handleInputChange} required />
                        </FormGroup>
                        <FormGroup>
                        <Label for="description">Description:</Label>
                        <Input type="text" id="description" name="description" value={course && course.description || ""} onChange={handleInputChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="image">Image URL:</Label>
                        <Input type="text" id="image" name="image" value={course && course.image || ""} onChange={handleInputChange} />
                    </FormGroup>
                    <button type="submit" className="btn btn-primary">Save Changes</button>
                    </Form>
                </CardBody>
                </Card>
            </Col>
            </Row>
        </Container>
      </div>
    );
}

export default CourseEditOrCreate;
