# Interview Assessement (faidhi-project)

This is a Vue 3 application using Quasar that demonstrates user authentication, theme toggling, and protected routing using the Composition API, Pinia, and Axios.

## Features
```
- User login with JWT authentication
- Token storage in localStorage
- Axios interceptors for token handling and global error responses
- Theme toggle (light/dark) with preference persistence
- Logout functionality
- Protected routes and auto redirect on token expiry
- Loading states and friendly error handling
- Pages like Home, About, Contact and Admin are placeholder routes to demonstrate router setup. Admin page can be access with user roles admin only
- Added test script for login and API request
```

## Code Documentation
```
Added detailed comments explaining each key feature and logic block within the code to improve readability and maintainability.
```

## Clone project repo
```
git clone https://github.com/FaidhiGhazali/faidhi-itools-assessment.git
```

## Install the dependencies
```
npm install
```

### Start the app in development mode
```
npx quasar dev
```

### Testing 
```
npx vitest
```