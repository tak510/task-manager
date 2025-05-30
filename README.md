# Task Manager Application

A simple task management system that I built with Spring Boot and MySQL, containerized using Docker.

## Features

* **User Authentication:** Secure user registration and login using JWT (JSON Web Tokens).
* **Task Management:** Create, read, update, and delete (CRUD) tasks.
* **User-Specific Tasks:** Tasks are associated with authenticated users, ensuring data privacy.
* **Data Persistence:** Uses a MySQL database for reliable data storage.
* **Containerized Environment:** Easily runnable locally using Docker Compose, providing a consistent development and deployment setup.

## Technologies Used

* **Backend:** Java 17, Spring Boot 3
* **Database:** MySQL 8.0
* **Authentication:** Spring Security, JWT
* **Containerization:** Docker, Docker Compose
* **Build Tool:** Maven

## How to Run Locally with Docker

This project is fully containerized for easy setup. Follow these steps to get it running on your machine:

1.  **Prerequisites:**
    * [Docker Desktop](https://www.docker.com/products/docker-desktop) (or Docker Engine) installed and running.
    * A `.env` file created in the root directory of the project (next to `docker-compose.yml`).

2.  **Create `.env` File:**
    In the root directory of the project, create a file named `.env` and add the following content. Feel free to change it up if you desire.

    ```env
    MYSQL_ROOT_PASSWORD=your_secure_root_password
    MYSQL_DATABASE=task_manager_db
    MYSQL_USER=task_manager_user
    MYSQL_PASSWORD=your_secure_app_password
    JWT_SECRET=a_very_long_and_random_string_for_your_jwt_secret_key_at_least_32_chars_or_more
    ```
    
3.  **Build and Run with Docker Compose:**
    Open your terminal, navigate to the project's root directory (where `docker-compose.yml` is located), and run:
    docker-compose up --build
    
5.  **Access the Application:**
    Once both containers are up and running, the Spring Boot application will be available at:
    `http://localhost:8080`
