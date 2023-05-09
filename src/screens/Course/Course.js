import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashCan, faPlus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './Course.css';
import { useAuth0 } from '@auth0/auth0-react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';



function Course() {
  const [activities, setActivities] = useState([]);
  const [allActivities, setAllActivities] = useState([]);
  const { id } = useParams();
  const { getAccessTokenSilently } = useAuth0();

  // MODALS
  const [selectedActivityId, setSelectedActivityId] = useState(null);

  const [modalDelete, setDeleteModal] = useState(false);
  const toggleDeleteModal = () => setDeleteModal(!modalDelete);
  const handleOpenDeleteModal = (id) => {
    setSelectedActivityId(id);
    toggleDeleteModal();
  };

  const [modalAddActivity, setAddActivityModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  const filteredActivities = allActivities.filter(activity =>
    activity.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const toggleAddActivityModal = () => setAddActivityModal(!modalAddActivity);
  const handleOpenAddActivityModal = (id) => {
    setSelectedActivityId(id);
    toggleAddActivityModal();
  };

  
  useEffect(() => {
    const fetchData = async () => {
        try {
            const accessToken = await getAccessTokenSilently({
                audience: 'https://fct-netex.eu.auth0.com/api/v2/',
            });
            const response = await fetch(process.env.REACT_APP_API_URL + "rest/courses/" + id + "/activities", {
                headers: {
                Authorization: `Bearer ${accessToken}`,
                },
            });

            const data = await response.json();
            setActivities(data)

        } catch (error) {
            console.error(error);
        }
    };
    fetchData();

    const fetchAllActivities = async () => {
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
          setAllActivities(data);
        } catch (error) {
          console.error(error);
        }
      };
  
      fetchAllActivities();
  }, []);

  const handleAddActivityToCourse = async (activityId) => {
    try {
      const accessToken = await getAccessTokenSilently({
        audience: 'https://fct-netex.eu.auth0.com/api/v2/',
      });

      await axios.post(process.env.REACT_APP_API_URL + "rest/courses/" + id + "/activities/" + activityId, {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Actualiza el estado de las actividades en el curso
      const addedActivity = allActivities.find(activity => activity._id === activityId);
      setActivities([...activities, addedActivity]);
    } catch (error) {
      console.error(error);
    }
  };

  const isActivityInCourse = (activityId) => {
    return activities.some(activity => activity && activity._id === activityId);
  };

  const handleDelete = async (deleteFromCourse) => {
    // if deleFromCourse is false, the activity will delete from database
    try {
        const accessToken = await getAccessTokenSilently({
            audience: 'https://fct-netex.eu.auth0.com/api/v2/',
        });

        if (deleteFromCourse){
            await axios.delete(process.env.REACT_APP_API_URL + "rest/courses/" + id + "/activities/" + selectedActivityId, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
        }else{
            await axios.delete(process.env.REACT_APP_API_URL + "rest/activities/" + selectedActivityId, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
        }

        setActivities(activities.filter(activity => activity && activity._id !== selectedActivityId));
        setAllActivities(allActivities.filter(activity => activity && activity._id !== selectedActivityId));

    } catch (error) {
        console.error(error);
    }
    toggleDeleteModal();
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

    {/* MODAL ADD ACTIVITY */}
    <Modal isOpen={modalAddActivity} toggle={toggleAddActivityModal} className="custom-modal">
      <ModalHeader toggle={toggleAddActivityModal}>Manage activities</ModalHeader>
      <ModalBody className="text-center">
        {/* Añade un campo de búsqueda */}
        <input
          type="text"
          placeholder="Search activities"
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        <ul className="activity-list">
          {filteredActivities.map(activity => (
            <li key={activity._id}>
              {activity.title}
              <br/>
              {isActivityInCourse(activity._id) ? (
                <>
                <Button color="warning" onClick={() => handleOpenDeleteModal(activity._id)}>
                  Remove from course
                </Button>
                <br/><br/>
                </>
              ) : (
                <>
                <Button color="success" onClick={() => handleAddActivityToCourse(activity._id)}>
                  Add to course
                </Button>
                <br/><br/>
                </>
              )}
            </li>
          ))}
        </ul>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggleAddActivityModal}>
          Close
        </Button>
      </ModalFooter>
    </Modal>


    {/* MODAL DELETE ACTIVITY */}
    <Modal isOpen={modalDelete} toggle={toggleDeleteModal}>
        <ModalHeader toggle={toggleDeleteModal}>Delete activity</ModalHeader>
        <ModalBody className="text-center">
            <Button color="danger" onClick={() => handleDelete(true)}>
            Delete activity from course
            </Button>
            <br/><br/>
            <Button color="danger" onClick={() => handleDelete(false)}>
            Delete activity
            </Button>
        </ModalBody>
        <ModalFooter>
            <Button color="secondary" onClick={toggleDeleteModal}>
            Cancel
            </Button>
        </ModalFooter>
    </Modal>


    <div className="activity-cards">
      <div className="activity-card2">
          <Link onClick={toggleAddActivityModal} className="add-activity-link">
            <FontAwesomeIcon icon={faPlus} />
            <span> Manage activities</span>
          </Link>
        </div>
        {activities.filter((activity) => activity !== null).map((activity) => (
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
                // onClick={() => handleDelete(activity._id)}
                onClick={() => handleOpenDeleteModal(activity._id)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Course;
