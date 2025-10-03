# JPL - Pre-visualization & Budgeting Tool 🎬

An advanced tool for film pre-visualization and budget management, built with React. This application helps filmmakers and production managers to structure their projects, visualize assets and shots, and create detailed budgets.

## About The Project

This web application provides a comprehensive solution for managing the pre-production phase of a film project. It combines hierarchical project organization with powerful budgeting features.

### Core Features:

*   **Hierarchical Structure:** Organize your project in a logical hierarchy:
    *   Project
        *   Sequence
            *   Scene
                *   Shot

*   **Pre-visualization Views:**
    *   **Previs Shots:** A gallery of all shots for a quick visual overview.
    *   **Previs Assets:** Browse assets categorized by type (Characters, Environments, Props, etc.).

*   **Detailed Budgeting (`Previs Budget`):**
    *   **Assets & Shots Budget:** Create detailed budget tables for assets and shots with fields for artist days, revisions, team size, and complexity.
    *   **Team & Rate Management:** Define team roles, headcount, rates (per day/week), and productivity multipliers.
    *   **Production Costs:** Add and manage production-related costs.
    *   **Scenario Summary:** Get a comprehensive summary of your budget, including:
        *   Total artist days.
        *   Project duration based on team capacity.
        *   Cost breakdown for assets, shots, and production.
        *   A cost distribution pie chart for a clear visual summary.

*   **Interactive & Dynamic:**
    *   Drill-down navigation to move through the project hierarchy.
    *   Editable tables for on-the-fly budget adjustments.
    *   Data persistence using the browser's `localStorage`.

## Built With

*   [React.js](https://reactjs.org/)
*   [Framer Motion](https://www.framer.com/motion/) for animations.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You need to have Node.js and npm installed on your machine.
*   You can check if you have npm installed by running:
    ```sh
    npm -v
    ```

### Installation

1.  Clone the repo
    ```sh
    git clone <your-repo-url>
    ```
2.  Navigate to the project directory
    ```sh
    cd jpl
    ```
3.  Install NPM packages
    ```sh
    npm install
    ```
4.  Run the app in development mode
    ```sh
    npm start
    ```
    Open [http://localhost:3000](http://localhost:3000) to view it in your browser.