# Metropolice technical test (10 May 2024)

## Development Environment
* Debian 12.5.0

# Todo List:
## Angular -> Frontend
    1. [] Admin register page
            [] Redirect to the login page, if successful.
    2. [] Client Register page - for client
            [] Redirect to the login page, if successful.
    3. [] Login page - for client and admin
            [] Redirect to the dashboard page, if successful.
                [] Data Include: Name, Email, and Phone number.
    4. [] Dashboard page
            [] if admin account, show all user information in a table
                [] Can sorting by pressing column name
                [] Pagination
            [] if client account, show themselve information only.

## Django RESTful -> Backend
    1. [] Change default DB to MqSQL.
    2. [] Set connection pooling.
    3. [] Create API 
            [] Insert API 
            [] Update API
    4. [] Multithread for process API with pooling
    5. [] RabbitMQ (optional)

## MySQL -> database
    1. [] Create database 
    2. [] Create table
            [] Constrain Unique

