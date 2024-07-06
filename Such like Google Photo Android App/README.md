# PICTSMANAGER - Application use to handle pictures

## TAKE, STORE, TAG AND HANDLE PICTURES

# Rules Firebase

service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
} 


# To launch the app

Go into android studio and in files, update gradle build files
Otherwise you can download directly on your phone with apk in the project

# The database
You can't acces to the database except if i give you the rules,
But you can easily create your firebase storage and implement the rules like above.
The data format is saved with the form of data Kotlin class present in the project.

# CICD 
You can launch the docker and the jenkins will be operationnaly, he intercept the commit push and check the quality with sonar Cube

## GOOD TESTING
