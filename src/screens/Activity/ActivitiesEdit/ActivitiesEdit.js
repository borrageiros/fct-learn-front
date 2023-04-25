import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Card, CardBody, CardHeader, Col, Container, Form, FormGroup, Input, Label, Row } from 'reactstrap';

import './ActivitiesEdit.css';

function ActivityEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();

  const [activity, setActivity] = useState({
    title: '',
    content: '',
    type: '',
    description: '',
    image: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = await getAccessTokenSilently({
          audience: 'https://fct-netex.eu.auth0.com/api/v2/',
        });
        const response = await fetch(process.env.REACT_APP_API_URL + "rest/activities/" + id, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await response.json();
        setActivity(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [id]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setActivity((prevActivity) => ({
      ...prevActivity,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const accessToken = await getAccessTokenSilently({
        audience: 'https://fct-netex.eu.auth0.com/api/v2/',
      });
      const response = await fetch(process.env.REACT_APP_API_URL + "rest/activities/" + id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(activity),
      });
      navigate('/activities');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="cardFormulario">
      <Container className="mt-4">
        <Row>
          <Col>
            <Card>
              <CardHeader className='editTitle'>Edit Activity</CardHeader>
              <CardBody>
                <Form onSubmit={handleSubmit}>
                  <FormGroup>
                  <Label for="title">Title: <span className="requiredEdit">*</span></Label>
                    <Input type="text" id="title" name="title" value={activity.title} onChange={handleInputChange} required/>
                  </FormGroup>
                  <FormGroup>
                    <Label for="content">Content: <span className="requiredEdit">*</span></Label>
                    <Input type="text" id="content" name="content" value={activity.content} onChange={handleInputChange} required/>
                  </FormGroup>
                  <FormGroup>
                    <Label for="type">Type: <span className="requiredEdit">*</span></Label>
                    <Input type="text" id="type" name="type" value={activity.type} onChange={handleInputChange} required/>
                  </FormGroup>
                  <FormGroup>
                    <Label for="description">Description:</Label>
                    <Input type="text" id="description" name="description" value={activity.description} onChange={handleInputChange} />
                  </FormGroup>
                  <FormGroup>
                    <Label for="image">Image URL:</Label>
                    <Input type="text" id="image" name="image" value={activity.image} onChange={handleInputChange} />
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

export default ActivityEdit;
