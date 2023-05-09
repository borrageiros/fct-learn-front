import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Container,
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Button
} from "reactstrap";

const Profile = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [name, setName] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  // GET USER
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {

        // Get token with scopes
        const accessToken = await getAccessTokenSilently({
          audience: `https://fct-netex.eu.auth0.com/api/v2/`,
        });
        console.log(accessToken)
        // Get user info
        const userResponse = await fetch(`https://fct-netex.eu.auth0.com/api/v2/users/${user.sub}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const userInfo = await userResponse.json();

        // Get user roles
        const userRolesResponse = await fetch(process.env.REACT_APP_API_URL + "users/roles", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const userRoles = await userRolesResponse.json();

        setUserRoles(userRoles.roles)
        setUserInfo(userInfo);
        setName(userInfo.nickname)
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, [getAccessTokenSilently]);


  // UPDATE USER
  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  const updateNickname = async () => {
    try {
      const accessToken = await getAccessTokenSilently({
        audience: `https://fct-netex.eu.auth0.com/api/v2/`,
      });

      const response = await fetch(process.env.REACT_APP_API_URL + "users/update-nickname", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ nickname: name }),
      });

      if (!response.ok) {
        throw new Error(`Error updating nickname: ${response.statusText}`);
      }

      window.location.assign("/")
    } catch (error) {
      console.error("Error updating nickname:", error);
      alert("Error al actualizar el nombre de usuario");
    }
  };
  
  const renderDisabledField = (label, value) => (
    <FormGroup>
      <Label>{label}</Label>
      <Input type="text" value={value} disabled />
    </FormGroup>
  );

  return (
    <Container>
      <Row>
        <Col sm="12" md={{ size: 6, offset: 3 }}>
          {userInfo ? (
            <>
              <div className="text-center">
                <img
                  src={userInfo.picture}
                  alt={`${name}'s avatar`}
                  className="img-thumbnail rounded-circle mb-4"
                  style={{ width: "150px", height: "150px" }}
                />
              </div>
              <FormGroup>
                <Label>Nombre</Label>
                <Input type="text" value={name} onChange={handleNameChange} />
              </FormGroup>
              {renderDisabledField("Correo electrónico", userInfo.email)}
              {renderDisabledField("Contraseña", "******")}
              {renderDisabledField("Roles", userRoles.map((role) => role.name).join(', '))}
              <div className="text-center">
                <Button color="primary" onClick={updateNickname}>
                  Guardar cambios
                </Button>
              </div>
            </>
          ) : (
            <p>Cargando información del perfil...</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;