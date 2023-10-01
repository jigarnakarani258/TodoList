#  Welcome to Todo-list
Todo-list - Web APP

Greetings to all. In this project, we'll build a backend for web applicationtion using MERN stack Todo-list - Web APP. We'll examine how to use passport-jwt strategy for user authentication. Use the Todo-list Web APP for daily routines life tasks management.

# Features
Todo-list - Web APP has functionality of user registration and login into our portal. 
This App provide role Task management of user. he can only access of his owns tasks.
This App also provide filtering based on attribute , pagination for retriving large data into page wise and user authentication.
Cron-Job :- Todo-list-APP runs every day at midnight (1 AM) to automatically mark todo items with an expired due date as completed. 
You can also access this app using swagger-UI and postman-collection.

# Technologies to use
Backend Development - Express.js / Node.js
User Authentication - passport-jwt strategy
Database - MongoDB
ODM - Mongoose library
Follow Strandard Arcitecture - Add ErrorController 

# Working with the Project
Download this project from the above link. check configaration file into the project named with "config.env"
check config.env file and put this code inside it if it is not present there.

config.env
```
NODE_ENV = production 
PORT = 3000
DATABASE_LOCAL = mongodb://127.0.0.1:27017/TodoListDB

JWT_SECRETKEY=my-super-secret-key-for-project
JWT_EXPIRESIN=30d
```

*********************** Write command for start the back-end server ************************
Download Todo-list-APP package from this GitHub repo. 
1). Now install all dependencies using below command , 
Open Terminal and hit this command:- npm install 

Start server using below command Open Terminal and hit this command:- 
command:- npm run start 

Now open any Browser
Request on this server http://localhost:3000 , This request load swagger-ui of this project with 2 section.

Check below functionality. 
a) User Management with - User Authentication SignUp & LogIn, GetCurrentProfile , updateCurrentUserProfile , getAllUserList .
b) Task Management :- filtering based on task's attribute , pagination for retriving large data into page wise and createTask , getTaskByID, updateTaskByID , deleteTaskByID,getAllTaskList .
c) Cron-Job :- Todo-list-APP runs every day at midnight (1 AM) to automatically mark todo items with an expired due date as completed. 

You can Check backend API using postman collection also. 
Import This collection in your postman – app Task_management.postman_collection.json 
Make API request on http://localhost:3000/api/v1 on NodeJs server.