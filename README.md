# React + TypeScript + Vite

Bajaj Finserv Qualifier - Dynamic Form Application
Overview
This is a React-based application built using TypeScript, designed for the Bajaj Finserv qualifier. The application allows a student to:

Log in using Roll Number and Name.
Register via a POST /create-user API call.
Fetch and render a dynamic form structure using GET /get-form API.
Validate form inputs dynamically based on API response.
Navigate through multiple form sections with validation checks.
Submit the final form data to the console.

Features

Login System: Enter Roll Number and Name to authenticate.
Dynamic Form: Fetches form structure and renders it section-wise.
Validation: Ensures required fields, minLength, min/max constraints per section.
Navigation: Prev/Next buttons per section, Submit button on the last section.
Responsive Design: Utilizes Tailwind CSS for styling.

Prerequisites

A modern web browser (Chrome, Firefox, etc.).
Internet connection to load React and Tailwind CSS from CDN.

Setup

Clone the repository or use the provided index.html file.
Open index.html in a browser to run the application.
No local server or build process is required as it uses CDN-hosted dependencies.

Usage

Enter your Roll Number and Name in the login form.
Submit to register and fetch the dynamic form.
Fill out each section, ensuring all validations are met.
Use Prev/Next buttons to navigate sections.
Submit the final form to log data to the console.

API Endpoints (Mocked)

POST /create-user: Registers the user with Roll Number and Name.
GET /get-form: Returns the dynamic form structure with sections and fields.

Technologies Used

React: For building the user interface.
TypeScript: For type safety and development.
Tailwind CSS: For responsive and modern styling.
Babel: For transpiling JSX.

Contributing
This project is tailored for the Bajaj Finserv qualifier. Contributions are not currently accepted, but feel free to fork and modify for personal use.
License
This project is for educational purposes only and is not licensed for commercial use.
ommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
