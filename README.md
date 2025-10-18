<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Dzak & Asri's Housewarming Party RSVP

This is a web application for Dzak and Asri's housewarming party, designed with a London Underground theme. Guests can RSVP and assign themselves to a "tube line" (session).

## Features

- **RSVP System:** Guests can confirm their attendance.
- **Interactive Seating:** Guests can assign themselves to a session, themed as a tube line.
- **Real-time Updates:** Built with Firebase Realtime Database for live data synchronization.
- **Themed UI:** A fun and engaging user interface based on the London Underground map.

## Run Locally

**Prerequisites:** Node.js and a Firebase project.

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Configure Firebase:**
    - Create a `services/firebase.ts` file.
    - Add your Firebase project's configuration to this file.
3.  **Run the app:**
    ```bash
    npm run dev
    ```

## Deploy to Firebase

1.  **Install Firebase CLI:**
    ```bash
    npm install -g firebase-tools
    ```
2.  **Login to Firebase:**
    ```bash
    firebase login
    ```
3.  **Deploy:**
    ```bash
    firebase deploy --only hosting
    ```
