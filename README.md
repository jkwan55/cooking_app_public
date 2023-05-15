# Quick Start Guide

- Starting the backend:
  - cd backend
  - pip3 install -r requirements.txt
  - python3 manage.py runserver
  
- Starting the frontend:
  - cd frontend
  - npm install
  - npm start

# Architectural Design

- Backend (Django)
  - backend/
    - schema.py, graphql connection to database using graphene
    - urls.py, url connection to admin and grpahql
  - cooking/
    - models.py, database types and default values
    - urls.py & views.py, for REST APIs (removed)
    
- Frontend (ReactJS with TypeScript)
  - src/
    - Dashboard/, displays dishes and can be added/viewed here
    - Fridge/, displays ingredients and can be added/viewed here
    
- GraphQL
  - Frontend update query variables with ApolloClient
  - Goes to the GraphQL backend with the url
  - GraphQL queries and updates database if needed through schema.py connection

# After Review (5/14)

  - Issues
    - The Website is not very intuitive
    - There's no delete button for dishes
    - Building of the site with small VM
    - Versioning of many packages with GraphQL/Graphene/GraphQL + Auth
  - Decisions Made
    - To speed up the building of the site, some features were not added (in todos)
    - Was planning to use ElasticSearch for fuzzy searching, but since I grabbed values from GraphQL I can just alter the list, also its like another database
  - Todos
    - Add more UI, maybe some notifications to tell users what happens after logging in
      - measurements for fridge/ingredients
      - count for fridge/ingredients
      - icon indicating missing ingredients
      - email verification and password resetting
