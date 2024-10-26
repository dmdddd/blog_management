# Blog  
### Overview
This is a blog management application, written using the MERN stack.  
(MERN = MongoDB, Express, React, and Node.js)

# Functionality
Guests can browse articles  
<img src="Images/articles.jpg" width="200">  
Guests can login and register - email is not being validated to make development easier  
<img src="Images/login.jpg" width="200">  
Users can set up a display name (to be used instead of the email when commenting) and a profile picture  
<img src="Images/profile_update.jpg" width="200">  
Anyone can read articles, while logged in users can upvote articles(single upvote per user), comment on them and remove their own comments  
<img src="Images/article.jpg" width="200">  


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

