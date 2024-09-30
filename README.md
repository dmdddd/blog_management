# Blog  
### Overview
This is a blog management application, written using the MERN stack.  
(MERN = MongoDB, Express, React, and Node.js)

### Technical Requirements
- Users can login using Firebase Auth
- Logged users can upvote an article, ones
- Logged users can comment on articles
- Non logged users can read articles

# Tech
### How to run
Frontend  
``npm start``  
Backend  
``npm run dev``  

#### Frontend  
React  
Packages: axios, firebase  
#### Backend  
Node.js  
Packages: express, firebase-admin, dotenv, nodemon 

To build:
rm -r my-blog-backend\build
cd my-blog
npm run build
cp -r .\build\ ..\my-blog-backend\

