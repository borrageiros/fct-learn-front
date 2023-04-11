import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import './ActivitiesEdit.css';

function ActivityEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activity, setActivity] = useState({
    title: '',
    description: '',
    type: '',
    content: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/rest/activities/${id}`);
        setActivity(response.data);
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
      await axios.put(`http://localhost:3000/rest/activities/${id}`, activity);
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="cardFormulario">
    <div>
      <h1>Edit Activity</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input type="text" id="title" name="title" value={activity.title} onChange={handleInputChange} />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <input type="text" id="description" name="description" value={activity.description} onChange={handleInputChange} />
        </div>
        <div>
          <label htmlFor="type">Type:</label>
          <input type="text" id="type" name="type" value={activity.type} onChange={handleInputChange} />
        </div>
        <div>
          <label htmlFor="content">Content:</label>
          <input type="text" id="content" name="content" value={activity.content} onChange={handleInputChange} />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
    </div>
  );
}

export default ActivityEdit;
