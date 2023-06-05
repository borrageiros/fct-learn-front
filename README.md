
![](https://downloads.borrageiros.com/NETEX/LogoLearn.png)
# 
Learn se basa en una plataforma en línea para la gestión de cursos virtuales dirigida a instituciones educativas. El propósito principal de esta plataforma es brindar a profesores y estudiantes una herramienta integral que facilite la administración de clases en línea, promueva la interacción y el intercambio de conocimientos, y proporcione un entorno de aprendizaje efectivo.

La plataforma está diseñada para atender las necesidades tanto de profesores como de estudiantes. Su estructura básica consta de cursos que a su vez están formados por un conjunto de actividades; una actividad puede estar en tantos cursos como se desee.

Se divide en dos componentes principales: una aplicación móvil, destinada a los estudiantes, y una página web administrativa (este repositorio), accesible solo para los profesores. Durante el desarrollo del proyecto, hemos considerado la inclusión de diferentes tipos de actividades para evaluar el conocimiento de los estudiantes.

La aplicación móvil permitirá a los estudiantes acceder y participar en cursos y actividades. Por otro lado, la página web administrativa proporcionará a los profesores las herramientas necesarias para gestionar y administrar su contenido. Podrán añadir, modificar y eliminar cursos y actividades, asegurando así un control completo sobre el contenido educativo.
# 
#### Tipos de actividades

- **Texto:** Son preguntas simples que esperan una respuesta simple o a desarrollar, estas serán corregidas por inteligencia artificial con la tecnología de Openai
- **Verdadero/Falso:** Tipo test
- **Múltiples opciones:** Una cantidad de posibles respuestas indefinidas de las cuales sólo una será la correcta



# 
#### Requisitos 

La web podrá ser desplegada en un servidor web convenvional como apache o nginx



# 
#### Arquitectura software

El proyecto se basa en 5 "componentes/pantallas" principales, que constan de:

- Header: Podríamos decir que este es nuestro componente principal que permite realizar las acciones más relevantes:

	- Ir a la página principal donde se listan todos los cursos
	- Listar todas las actividades
	- Ir al endpoint que permite crear tanto Cursos como Actividades
	- Entrar a la configuración de nuestro perfil
	- Cerrar sesión

- Actividades: Está subdividido en 3 funciones que equivalen a distintas pantallas; una que muestra todas las actividades, otra para crearlas y finalmente para editarlas.

- Cursos: Los cursos siguen la misma lógica que las actividades salvo por una excepción, esta vez el componente de crear y editar lo fusionamos en una sóla función para hacer el código menos extenso, esto lo logramos con un parámetro URL que le dice al componente cúal de las dos acciones se quiere realizar. Ejemplo:
  
https://…/course/edit/64537f0302a47fd84208a0e7  
https://…/course/create/0

- Home: Es nuestra pantalla principal, desde aquí puedes acceder al listado de cursos, editarlos o borrarlos, a su vez el Header permite realizar todas las acciones globales que comentamos. Éste componente también se asegura de que el usuario esté logueado; si no es el caso redirige al servicio privado de Auth0 para nuestra aplicación

- Profile: Muestra los datos más relevantes de un usuario: Nombre, Correo electrónico, Contraseña y Roles, de éstos permite modificar sólo el Nombre.



# 
#### Instalación
Instalación:

		npm install

Para desarrollo:

		npm run start

Para producción:

		npm run build

# 
#### Demo  
WEB: https://learn.borrageiros.com/  
API: https://vm15.netexlearning.cloud/
