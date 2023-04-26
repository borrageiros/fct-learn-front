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


  const renderOptions = (activity) => {
    if (activity.type === 'Multiple options') {
      return (
        <ul>
          {
            activity.options.map((option, index) => (
              <li key={index}>
                <span style={option.correct ? { border: 'solid 0.3vh #5BD52D', padding: '2px', borderRadius: '10px' } : {}}>
                  {String.fromCharCode(65 + index) + ') '}
                  {option.text}
                </span>
              </li>
            ))
          }
        </ul>
      );
    }
    return null;
  };
  

  const renderTrueFalse = (activity) => {
    if (activity.type === 'True/False') {
      return <p>{activity.isTrue ? 'True' : 'False'}</p>;
    }
    return null;
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
            <p>{activity.content}</p>
            {renderTrueFalse(activity)}
            {renderOptions(activity)}
            {activity.description && <p>{activity.description}</p>}
            {activity.image && <img src={activity.image} alt="" />}
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
