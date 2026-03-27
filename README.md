# CtrlThreats
CtrlThreats focuses on providing actionable, reliable, and timely (ART) threat intelligence to protect businesses from cyber threats. It combines human expertise with AI and machine learning to analyze external and internal threats, enabling organizations to make informed decisions. Through research and regular reports, CtrlThreats helps identify trends, exploitations, and attacks, offering crucial insights for businesses to enhance their cybersecurity posture

# Git and GitHub Contribution Rules

This document outlines the rules for using Git and GitHub for contributions to our project. Please adhere to these guidelines to maintain consistency and quality across our codebase.

## Branching Strategy

Our project uses the following branches:
- `main` - Production-ready code. Only maintainers can merge into `main`.
- `development` - Latest code under development. All changes are integrated here after review.
- `feature/*` - Used for new features. One branch per feature.
- `bugfix/*` - For bug fixes that aren't urgent.
- `hotfix/*` - For urgent bug fixes that need to go directly to `main`.

### Branch Naming Conventions
- `feature/[feature-name]`: For new features, e.g., `feature/user-authentication`.
- `bugfix/[issue-description]`: For non-urgent bug fixes, e.g., `bugfix/login-error`.
- `hotfix/[issue-description]`: For urgent fixes, e.g., `hotfix/password-reset`.
- Branch names should be lowercase, use hyphens for spaces, and be descriptive.

## Workflow

1. **Creating a Branch**  
   - Always create a new branch from the `development` branch for features and non-urgent bug fixes.
   - For hotfixes, branch from `main` and merge directly back into `main` after review.
   
2. **Making Commits**  
   - Commit messages should be concise but descriptive.
   - Follow the format: `[Type] Short description of changes`, e.g., `[Fix] Resolved login error on mobile`.
   - Commit frequently with small, manageable changes.

3. **Pull Requests (PRs)**  
   - PRs must be created when merging `feature/*`, `bugfix/*`, or `hotfix/*` branches.
   - All PRs should target the `development` branch, except for hotfixes, which should target `main`.
   - PR titles should match the branch name and provide context.
   - Provide a clear description of what was changed, why, and any relevant issue numbers.

4. **Code Reviews**  
   - All PRs require at least one reviewer to approve the changes.
   - Ensure your code follows project standards and passes all tests before requesting a review.
   - Address feedback promptly; avoid rebasing or squashing commits unless necessary.

5. **Merging**  
   - Only maintainers can merge to `main` and `development`.
   - After PR approval, use **merge** to keep the workflow clean.
   - For hotfixes, merge directly into `main` and then immediately back into `development`.

## Commit Message Conventions

- **[Feature]** - For new features.
- **[Fix]** - For bug fixes.
- **[Hotfix]** - For urgent fixes to be deployed to production.
- **[Docs]** - Documentation changes.
- **[Refactor]** - Code restructuring without feature changes.
- **[Test]** - Adding or updating tests.

Example commit message: `[Feature] Added user authentication flow`

## General Guidelines

- **Sync Regularly**: Frequently pull the latest changes from `development` to avoid conflicts.
- **Stay Organized**: Follow branch naming conventions and commit message formats.
- **Documentation**: Comment and document code where necessary, especially complex logic.

By following these guidelines, we can ensure a well-maintained and efficient development process. Thank you for contributing!

---

## Project Overview

**CtrlThreats** is a comprehensive web application designed for the security analysis of domains and emails. It is built with a microservices architecture, where each component is containerized using Docker and orchestrated with Docker Compose. The application provides users with actionable, reliable, and timely (ART) threat intelligence to protect their businesses from various cyber threats.

The system is composed of a React-based frontend, a primary Django backend, two specialized backend microservices for web scanning and email phishing analysis, a PostgreSQL database, and an Nginx web server acting as a reverse proxy.

## System Architecture

The application follows a microservices architecture, with different services for the frontend, main backend logic, and specialized scanning tasks. All services are containerized and managed by Docker Compose.

[View System Architecture Diagram](SYSTEM_ARCHITECTURE.md)

## Design Document

### 1. Frontend (`frontend/`)
*   **Technology**: React with Vite.
*   **Role**: Serves the user interface and provides a dashboard for users to initiate scans and view results.
*   **Communication**: Interacts with the backend by making API calls to the `/api/` endpoint, which is routed by Nginx to the Django backend.
*   **Docker Service**: `frontend`, running on port `3000`.

### 2. Nginx (`nginx/`)
*   **Technology**: Nginx.
*   **Role**: Acts as a reverse proxy for the entire application. It handles incoming HTTPS requests, serves the React frontend for the root path (`/`), and forwards all requests to `/api/` to the Django backend. It also handles SSL termination with Certbot.
*   **Docker Service**: `nginx`.

### 3. Django Backend (`django/`)
*   **Technology**: Django, Django REST Framework.
*   **Role**: The central backend service that manages user authentication, user data, blogs, contact forms, and subscriptions. It acts as an orchestrator, receiving API requests from the frontend and then calling other specialized backend microservices to perform the required security scans.
*   **Database**: Uses a PostgreSQL database to store application data.
*   **Docker Service**: `django`, running on port `8000`.

### 4. Web Scan Service (`backend/`)
*   **Technology**: FastAPI (originally Flask).
*   **Role**: A specialized microservice that provides a wide range of security scanning tools for domains. Its features include IP address resolution, SSL/TLS certificate analysis, DNS record retrieval, cookie scanning, HTTP header inspection, and more.
*   **Communication**: It is called by the Django backend when a web scan is requested.
*   **Docker Service**: `web_scan_flaskapp`, running on port `8001`.

### 5. Email Phishing Service (`PhishingEmail/`)
*   **Technology**: Flask.
*   **Role**: A dedicated microservice for analyzing email headers to detect potential phishing indicators.
*   **Communication**: It is called by the Django backend when an email header analysis is requested.
*   **Docker Service**: `email_phising_flaskapp`, running on port `5000`.

### 6. Database
*   **Technology**: PostgreSQL.
*   **Role**: The primary database for the Django application, storing all persistent data.
*   **Docker Service**: `ctrlthreat-db`, running on port `5432`.

### Overall Workflow

1.  A user accesses the website, and their browser sends an HTTPS request to the server.
2.  Nginx receives the request. If it's for the main site, it serves the React frontend. If it's an API call (e.g., `/api/webscan?domain=example.com`), it forwards the request to the Django backend.
3.  The Django backend receives the API request. After authenticating the user, it determines which specialized service is needed.
4.  For a web scan, Django makes a request to the **Web Scan Service**. For an email analysis, it calls the **Email Phishing Service**.
5.  The specialized service performs the scan and returns the results to the Django backend.
6.  Django processes the results and sends them back to the frontend in a JSON response.
7.  The React frontend receives the data and displays the results to the user.
# ctrl-threats
