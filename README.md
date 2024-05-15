# Metropolice technical test (10 May 2024)

## Development Environment
* Debian 12.5.0

# Todo List:
## Angular -> Frontend
    1. [x] Client Register page - for client
            [x] Redirect to the login page, if successful.
    2. [x] Login page - for client and admin
            [x] Redirect to the dashboard page (admin / client), if successful.
    3. [x] Dashboard page (admin)
            [x] if client account, show themselve information in a update and delete form.
    4. [x] Admin dashboard page (Login by default account)
            [x] Table show all user data
            [x] Can sorting by pressing column name
            [x] Pagination
            [x] Odometer for show number of user

## Django RESTful -> Backend
    1. [x] Change default DB to MqSQL.
    2. [x] Set connection pooling.
    3. [x] Create API 
        	[x] Insert API - Create Users
			[x] Read API 
				[x] For Login (Respond success or error)
				[x] For Dashboard (Respond user detail or all user detail with pagination)
            [x] Update API
				[x] For user update thier data
				[x] For admin update (deactive) user data
    4. [x] Concurrecy for process API with pooling
            [x] Install Celery for handle concurrecy processing (Queue)
				- Becuase all register account process will be in queue, it won't respond successfully create the account or not
			[x] Apply websocket
				- Once user submite the form and frontend will received a general message (in processing)
				- Now, the frontend will start connect websocket with backend
					- If the process already done, then the status and remark will response immediately
					- If the process still in processing, then will wait unitl a message which send by celery listener.
					- Once received all necessary info, frontend will send a delete query the delete the task_id in a temporary db.
			[x] Install Redis
	5. [x] Json Web Token (PyJWT)
			[x] JWT set cookies when login
			[x] Delete cookies when logout

## MariaDB -> database
    1. [x] Create database 
    2. [x] Create table
			[x] Client Table
            	[x] Constrain Unique - username and email
			[x] Temporary task id table
				- for keep celery task id and status


