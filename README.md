# Read this first
+ on openning this repository you cannot see any files , because you need to change branch to "deploy" or "master"
+ if you are in deploy branch you can see a folder named "dist". this is a build version of frontend(react code). you can see the frentend react code in the repository https://github.com/chandra1899/socialDraft_frontend.git

+ this project is deployed on render.com , live at https://socialdraft.onrender.com/

# setup locally 

### dependencies

+ Nodejs
+ MongoDB


+ paste the below cmd's in terminal
  
  ```
  git clone https://github.com/chandra1899/socialDraft_backend.git
  ```
  ```
  cd socialDraft_backend
  ```

  + now you need to change branch
 
    ```
    git checkout deploy
    ```

  + To install all dependencies
   
      ```
      npm install
      ```

  + copy all the feilds from environment.txt to .env file (don't have .env file creaate it in the root directory)

      ```
      cp .\environment.txt .env
      ```
      + Fill the feild in .env file

      +  GOOGLR_CALLBACKURL should be like

        ```
        http://localhost:8000/api/user/auth/google/callback
        ```
     +  FACEBOOK_CALLBACKURL should be like

        ```
        http://localhost:8000/api/user/auth/facebook/callback
        ```
 
    + now got to routes/api/user.js and on google , facebook callback route replace https://socialdraft.onrender.com/ with http://localhost:8000/ . this is 
      only if you use goole or facebook for login

      + TO start app
     
          ```
          npm start
          ```

      + Now app is running on http://localhost:8000/
