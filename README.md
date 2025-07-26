TerraMetrics: A 3D Globe for Global Economic Analysis
TerraMetrics is a responsive, data-driven web application that allows users to explore, visualize, and compare key economic indicators from countries around the world through an interactive 3D Earth globe. The project leverages modern web technologies to create an immersive and intuitive experience for data exploration, complete with AI-powered analysis.

Features
Interactive 3D Globe: A fully interactive 3D Earth, built with Three.js, serves as the primary navigation. It features auto-rotation, click-and-drag controls, and zoom functionality.

Real-Time Data Visualization: Sources economic data directly from the World Bank Open Data API. Users can select a country and view historical data for key indicators (GDP, Population, Inflation, etc.) rendered in clean, responsive charts using ngx-charts.

AI-Powered Economic Comparison: A dedicated "Compare" page allows users to select two countries. An AI assistant, powered by the OpenAI (ChatGPT) API, generates a concise economic comparison and provides a follow-up chat interface for asking clarifying questions.

Personalized User Dashboards: A full authentication system (Login/Register) allows users to create a personal account. Logged-in users can save either entire country profiles or individual indicator charts to their persistent dashboard.

AI Dashboard Assistant: On their personal dashboard, users can chat with an AI assistant that provides insights and suggestions based on the data they have saved.

Responsive Design: Built with Tailwind CSS, the user interface is fully responsive and provides a seamless experience on desktop, tablet, and mobile devices.

Tech Stack
Frontend: Angular 17+

3D Rendering: Three.js

Charting: ngx-charts

Styling: Tailwind CSS

Backend & Database: Firebase (Firestore, Authentication)

AI Integration: OpenAI API (gpt-3.5-turbo)

Data Source: World Bank Open Data API

Getting Started
Follow these instructions to get a local copy of the project up and running on your machine.

Prerequisites

Node.js and npm: Make sure you have Node.js (which includes npm) installed. You can download it from nodejs.org.

Angular CLI: Install the Angular Command Line Interface globally by running:

npm install -g @angular/cli

Installation & Setup

Clone the repository:

git clone https://github.com/pedrohpmodolo/TerraMetrics.git

Navigate to the project directory:

cd TerraMetrics

Install NPM packages:

npm install

Set up your API Key:

Navigate to the src/environments/ folder.

Create a new file named environment.development.ts.

Paste the following code into the new file and add your OpenAI API key:

export const environment = {
  production: false,
  openAiApiKey: 'YOUR_CHATGPT_API_KEY_HERE'
};

Note: This file is included in .gitignore and will not be committed to the repository, keeping your key safe.

Set up Firebase:

Go to the Firebase Console and create a new project.

In your new project, go to Build > Authentication and enable the "Email/Password" sign-in method.

Go to Build > Firestore Database and create a new database, starting in test mode.

In your project settings, add a new Web App. Firebase will provide you with a firebaseConfig object.

Copy this object and paste it into the firebase.json file in the root of the project.

Running the Application

Start the development server:

ng serve

Open your browser:

Navigate to http://localhost:4200/. The application will automatically reload if you change any of the source files.

