import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashCan, faPlus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './ActivitiesList.css';
import { useAuth0 } from '@auth0/auth0-react';


function ActivitiesList() {
  const [activities, setActivities] = useState([]);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = await getAccessTokenSilently({
          audience: 'https://fct-netex.eu.auth0.com/api/v2/',
        });
      const response = await fetch(process.env.REACT_APP_API_URL + "rest/activities", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      if (Array.isArray(data)) {
        setActivities(data);
      }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [getAccessTokenSilently]);

  const handleDelete = async (id) => {
    try {
      const accessToken = await getAccessTokenSilently({
        audience: 'https://fct-netex.eu.auth0.com/api/v2/',
      });
  
      await axios.delete(process.env.REACT_APP_API_URL + "rest/activities/" + id, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      setActivities(activities.filter(activity => activity._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="activity-cards">
        <div className="activity-card">
          <Link to="/activities/create" className="add-activity-link">
            <FontAwesomeIcon icon={faPlus} />
            <span>Add New Activity</span>
          </Link>
        </div>
        {activities.map((activity) => (
          <div className="activity-card" key={activity._id}>
            <h2>{activity.title}</h2>
            <p>{activity.description}</p>
            <p>{activity.type}</p>
            <p>{activity.content}</p>
            <div className="icons-container">
              <Link to={`/activities/edit/${activity._id}`} className="pencil-link">
                <FontAwesomeIcon icon={faPencilAlt} />
              </Link>
              <FontAwesomeIcon
                icon={faTrashCan}
                className="delete-icon"
                onClick={() => handleDelete(activity._id)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActivitiesList;
