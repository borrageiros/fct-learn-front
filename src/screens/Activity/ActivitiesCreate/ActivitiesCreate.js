import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Card, CardBody, CardHeader, Col, Container, Form, FormGroup, Input, Label, Row, Button } from 'reactstrap';

import './ActivitiesCreate.css';

function ActivityCreate() {
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const [trueFalse, setTrueFalse] = useState(false);
  const [options, setOptions] = useState([]);
  
  const [activity, setActivity] = useState({
    title: "",
    description: "",
    type: "",
    content: "",
    trueFalse: false,
    options: []
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setActivity((prevActivity) => ({
      ...prevActivity,
      [name]: value,
    }));
    if (name === 'type') {
      if (value === 'True/False') {
        setTrueFalse(true);
        setOptions([]);
      } else if (value === 'Multiple options') {
        setOptions([{ text: '', correct: false }, { text: '', correct: false }]);
        setTrueFalse(false);
      } else {
        setOptions([]);
        setTrueFalse(false);
      }
    }
  };

  const handleOptionsChange = (options) => {
    setActivity((prevActivity) => ({
      ...prevActivity,
      options,
    }));
  };
  
  const validateForm = () => {
    if (activity.type === 'Multiple options') {
      const hasCorrectOption = options.some((option) => option.correct);
      if (!hasCorrectOption) {
        alert('Por favor, seleccione una opción correcta.');
        return false;
      }
    }
    return true;
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }
    
    // Check if there are at least two options when the type is "Multiple options"
    if (activity.type === "Multiple options" && options.length < 2) {
      alert('Para el tipo "Multiple options" debe haber mínimo dos opciones');
      return;
    }

    try {
      const accessToken = await getAccessTokenSilently({
        audience: "https://fct-netex.eu.auth0.com/api/v2/",
      });
      await fetch(process.env.REACT_APP_API_URL + "rest/activities", {
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
                    <Label for="title">Title: <span className="requiredCreate">*</span></Label>
                    <Input type="text" id="title" name="title" value={activity.title} onChange={handleInputChange} required />
                  </FormGroup>
                  <FormGroup>
                    <Label for="content">Content: <span className="requiredCreate">*</span></Label>
                    <Input type="text" id="content" name="content" value={activity.content} onChange={handleInputChange} required />
                  </FormGroup>
                  <FormGroup>
                    <Label for="type">Type: <span className="requiredCreate">*</span></Label>
                    <Input type="select" id="type" name="type" value={activity.type} onChange={handleInputChange} required>
                      <option value="">Select an option</option>
                      <option value="Text">Text</option>
                      <option value="True/False">True/False</option>
                      <option value="Multiple options">Multiple options</option>
                    </Input>
                  </FormGroup>

                  {/* MULTIPLE OPTIONS */}
                  {activity.type === 'Multiple options' && (
                    <div>
                      {options.map((option, index) => (
                        <FormGroup key={index}>
                          <Label for={`option-${index}`}>Option {index + 1}</Label>
                          <Input
                            type="text"
                            id={`option-${index}`}
                            name={`option-${index}`}
                            value={option.text}
                            onChange={(e) => {
                              const newOptions = [...options];
                              newOptions[index].text = e.target.value;
                              setOptions(newOptions);
                              handleOptionsChange(newOptions);
                            }}
                            required
                          />
                          <FormGroup check>
                            <Label check>
                            <Input
                              type="radio"
                              name={`correct-${index}`}
                              checked={option.correct}
                              onChange={(e) => {
                                const newOptions = options.map((opt, optIndex) =>
                                  optIndex === index
                                    ? { ...opt, correct: true }
                                    : { ...opt, correct: false }
                                );
                                setOptions(newOptions);
                                handleOptionsChange(newOptions);
                              }}
                            />
                              Correct
                            </Label>
                          </FormGroup>
                          {options.length > 1 && (
                            <Button
                              color="danger"
                              disabled={options.length <= 2}
                              onClick={() => {
                                const newOptions = [...options];
                                newOptions.splice(index, 1);
                                setOptions(newOptions);
                                handleOptionsChange(newOptions);
                              }}
                            >
                              Remove
                            </Button>
                          )}
                        </FormGroup>
                      ))}
                      <Button
                        color="primary"
                        onClick={() => {
                          const newOptions = [...options, { text: "", correct: false }];
                          setOptions(newOptions);
                          handleOptionsChange(newOptions);
                        }}
                      >
                        Add Option
                      </Button>
                    </div>
                  )}


                  {/* TRUE OR FALSE */}
                  {activity.type === "True/False" && (
                    <FormGroup>
                      <Label for="isTrue">Is it True or False? <span className="requiredCreate">*</span></Label>
                      <Input type="select" id="isTrue" name="isTrue" value={activity.isTrue} onChange={handleInputChange} required>
                        <option value="">Select an option</option>
                        <option value="true">True</option>
                        <option value="false">False</option>
                      </Input>
                    </FormGroup>
                  )}

                  <FormGroup>
                    <Label for="description">Description: </Label>
                    <Input type="text" id="description" name="description" value={activity.description} onChange={handleInputChange} />
                  </FormGroup>
                  <FormGroup>
                    <Label for="image">Image URL: </Label>
                    <Input type="text" id="image" name="image" value={activity.image} onChange={handleInputChange} />
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