import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Card, CardBody, CardHeader, Col, Container, Form, FormGroup, Input, Label, Row, Button } from 'reactstrap';

import './ActivitiesCreate.css';

function ActivityCreate() {
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  const [activity, setActivity] = useState({
    title: "",
    description: "",
    type: "",
    content: "",
  });

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
        audience: "https://fct-netex.eu.auth0.com/api/v2/",
      });
      await fetch (process.env.REACT_APP_API_URL + "/rest/activities", {
      method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(activity),
      });
      navigate("/activities");
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
              <CardHeader className='createTitle'>Create Activity</CardHeader>
              <CardBody>
                <Form onSubmit={handleSubmit}>
                  <FormGroup>
                    <Label for="title">Title:</Label>
                    <Input type="text" id="title" name="title" value={activity.title} onChange={handleInputChange} required />
                  </FormGroup>
                  <FormGroup>
                    <Label for="description">Description:</Label>
                    <Input type="text" id="description" name="description" value={activity.description} onChange={handleInputChange} required />
                  </FormGroup>
                  <FormGroup>
                    <Label for="type">Type:</Label>
                    <Input type="text" id="type" name="type" value={activity.type} onChange={handleInputChange} required />
                  </FormGroup>
                  <FormGroup>
                    <Label for="content">Content:</Label>
                    <Input type="text" id="content" name="content" value={activity.content} onChange={handleInputChange} required />
                  </FormGroup>
                  <Button type="submit" color="primary">
                    Create
                  </Button>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>

  );
}

export default ActivityCreate;