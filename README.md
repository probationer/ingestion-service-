# Ingestion-service

Ingestion service basically is use to upload csv file to s3 and upload Uid and Platform information in bulk.


There is mainly two parts 
> 1. Frontend 
> 2. Backend

### Frontend 
Services used in frontend:
* React js 
* Library Material UI
* Hosted on AWS S3
> Link: http://ingestion-service.in.s3-website.ap-south-1.amazonaws.com/
### Backend 
Services used in backend: 
* S3
* Api Gateways
* Lambda
* Async Lambda
> Api Documentation: https://documenter.getpostman.com/view/10419790/TVt17itN#844ec499-18df-4c3a-b37b-8e3a7e69594c 


## System Design
![Ingestion service system design](https://s3.ap-south-1.amazonaws.com/ingestion-service.in/media/system-architecture-ingestion-service.png)

---
___
### Step for local setup
- git clone <repo_link>
#### Frontend: 
> - cd frontend
> - yarn install
> - yarn start

#### Backend: 
> - cd backend/lambda
> - npm install 
> - npm install serverless -g 
> - Add aws developer credentials : 
>   - export AWS_ACCESS_KEY_ID=xxxxx
>   - export AWS_SECRET_ACCESS_KEY=xxxxx
> - Run Lambda locally 
>   - sls invoke local -s dev -f <function_name> -p ../test/<mock_file.json>

