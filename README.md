# Job Portal Capstone Project

## Purpose of this project
QuickJob project is an online platform that connects employers and job seekers, allowing employees to search for jobs and apply, while enabling employers to post job requirements and manage applicants efficiently.

## Cloning and Running the Application in local
Clone the project into local

Navigate to the project directory and run the command below to install all the necessary npm packages.

```bash
npm install
```

In order to run the application Type the following command
``` bash
npm start
```
The Application Runs on **localhost:3000** 

## MySQL workbench setup in your local system
• Open the db_backup file from the repo & then execute the .sql file in your MySQL workbench

• In .env file of backend change the login credentials to yours

## Commonly Used commands: 

### npx create-react-app QuickJob
npx create-react-app QuickJob, quickly set up a new React application called "QuickJob" with a pre-configured environment. It automatically generatUpes the necessary files and folder structure to begin developing a React project.

### cd QuickJob
Navigate into the "QuickJob" project directory that was created by the previous command. This allows to start working within the project folder.

### npm install react-router-dom@latest
Installs the latest version of the react-router-dom package, which is essential for adding navigation and routing functionalities in a React application like QuickJob. It allows to manage different pages and routes within the app.

### npm start
Runs the QuickJob React application in development mode. It starts a local development server, allowing to view and interact with the app in the browser.

### ctrl + c
Pressing Ctrl + C in the terminal stops the running process, such as the React development server started by npm start. It terminates the local server and exits the running application.

### npm init -y
It Sets up a new Node.js project in the current folder by creating a package.json file with basic settings. The -y option means that we agree to the default choices without having to answer any questions.

### npm install express mysql dotenv
Installs three packages: Express, a web framework for building server applications; MySQL, a database driver for connecting to MySQL databases; and dotenv, a package for loading environment variables from a .env file into the application. This setup is essential for building a backend for QuickJob project.

### node server.js
 Runs the server.js file using Node.js, starting the server for your backend application.

### npm install cors
Installs the CORS (Cross-Origin Resource Sharing) middleware package. It allows your server to handle requests from different origins, enabling QuickJob app's frontend to communicate with the backend even if they're hosted on different domains.
