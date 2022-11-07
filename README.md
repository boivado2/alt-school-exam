# Blogging App
This is an api for a blogging app

---

## Requirements

1. Users should have a first_name, last_name, email, password
2. A user should be able to sign up and sign in into the blog app
3. Use JWT as authentication strategy and expire the token after 1 hour
4. A blog can be in two states; draft and published
5. Logged in and not logged in users should be able to get a list of published blogs created
6. Logged in and not logged in users should be able to to get a published blog
7. Logged in users should be able to create a blog.
8. When a blog is created, it is in draft state
9. The owner of the blog should be able to update the state of the blog to published
10. The owner of a blog should be able to edit the blog in draft or published state
11. The owner of the blog should be able to delete the blog in draft or published state
12. The owner of the blog should be able to get a list of their blogs:
    - The endpoint should be paginated
    - It should be filterable by state
13. Blogs created should have title, description, tags, author, timestamp, state, read_count, reading_time and body.
14. The list of blogs endpoint that can be accessed by both logged in and not logged in users should be paginated:
    -  default it to 20 blogs per page. 
    -  It should also be searchable by author, title and tags.
    - It should also be orderable by read_count, reading_time and timestamp
15. When a single blog is requested, the api should return the user information(the author) with the blog. The read_count of the blog too should be updated by 1
16. Come up with any algorithm for calculating the reading_time of the blog.
17. Write tests for all endpoints


---
## Setup
- Install NodeJS, mongodb
- pull this repo
- update env with example.env
- run `npm run start`
- run `npm run text`

---
## Base URL
- alt-school-exam-boivado.onrender.com/


## Models
---

### User
| field  |  data_type | constraints  |
|---|---|---|
|  id |  string |  required |
|  firstname | string  |  optional|
|  lastname  |  string |  optional  |
|  email     | string  |  optional |
|  password |   string |  required  |


### article
| field  |  data_type | constraints  |
|---|---|---|
|  id |  string |  required |
|  title |  string |  required, unique: true |
|  description |  string |  required |
|  created_at |  date |  required |
|  updated_at |  date |  required |
|  state | number  |  required,default:"draft",enum: ['draft', 'published'] |
|  total_price  |  number |  required  |
|  author     | object  |  required |
|  author.firstName |   string |  required  |
|  author.lastName |  string |  required |
|  author.email |  string |  required |
|  author.id |  string | 
|  body |  string |  required |
|  readCount |  number | default: 0 |
|  readingTime |  number |  default: 0|




## APIs
---

### Signup User

- Route: /signup
- Method: POST
- Body: 
```
{
  "email": "doe@example.com",
  "password": "Password1",
  "firstname": "jon",
  "lastname": "doe",
}
```

- Responses

Success
```
{
  "msg": "Register Successfully",
  "user": {
    "email": "doe@gmai1.com",
    "firstName": "john",
    "lastName": "doe"
  }
}
```
---
### Login User

- Route: /login
- Method: POST
- Body: 
```
{
  "password": "Password1",
  "email": 'doe@gmai1.com",
}
```

- Responses

Success
```
{
  "info": {
    "message": "successfully logged in."
  },
    "user": {
    "email": "doe@gmai1.com",
    "firstName": "john",
    "lastName": "doe"
  }}
```

---
### Create articles

- Route: /articles
- Method: POST
- Header
    - Authorization: Bearer {token}
- Body: 
```
{
   "title": "C++ beginners guide",
  "description" : "the guide beginners love to read",
  "authorId" : "6366f56243c3fbb0184f5e01",
  "tags": ["game", "c++"],
  "body": " The next step is the most complex. It’s where we take the text"
}
```

- Responses

Success
```
{
{
  "title": "C++ beginners guide",
  "description": "The guide beginners love to read",
  "author": {
    "firstName": "john",
    "lastName": "doe",
    "email": "doe@gmai1.com",
    "_id": "6366f56243c3fbb0184f5e01"
  },
  "state": "draft",
  "readCount": 0,
  "tags": [
    "game",
    "c++"
  ],
  "body": " The next step is the most complex. It’s where we take the text and then ",
  "_id": "63683295b7d556d832bb0a05",
  "readingTime": 1,
  "createdAt": "2022-11-06T22:17:57.914Z",
  "updatedAt": "2022-11-06T22:17:57.914Z",
  "__v": 0
}
}
```
---
### Get article

- Route: /articles/:id
- Method: GET
- Responses

Success
```
{
  "title": "C++ beginners guide",
  "description": "The guide beginners love to read",
  "author": {
    "firstName": "john",
    "lastName": "doe",
    "email": "doe@gmai1.com",
    "_id": "6366f56243c3fbb0184f5e01"
  },
  "state": "published",
  "readCount": 1,
  "tags": [
    "game",
    "c++"
  ],
  "body": " The next step is the most complex. It’s where we take the text and then ",
  "_id": "63683295b7d556d832bb0a05",
  "readingTime": 1,
  "createdAt": "2022-11-06T22:17:57.914Z",
  "updatedAt": "2022-11-06T22:17:57.914Z",
  "__v": 0
}

```
---

### Get articles

- Route: /articles
- Method: GET
- Query params: 
    - page (default: 1)
    - per_page (default: 20)
    - order_by (created_at, readingTime, readingCount)
    - order (options: asc | desc, default: desc)
     - state (default : published)
    - title
    - author
    - tag
- Responses

Success
```
[{
  "title": "C++ beginners guide",
  "description": "The guide beginners love to read",
  "author": {
    "firstName": "john",
    "lastName": "doe",
    "email": "doe@gmai1.com",
    "_id": "6366f56243c3fbb0184f5e01"
  },
  "state": "published",
  "readCount": 1,
  "tags": [
    "game",
    "c++"
  ],
  "body": " The next step is the most complex. It’s where we take the text and then ",
  "_id": "63683295b7d556d832bb0a05",
  "readingTime": 1,
  "createdAt": "2022-11-06T22:17:57.914Z",
  "updatedAt": "2022-11-06T22:17:57.914Z",
  "__v": 0
}
]
```
---


### Get article

- Route: /articles/:id
- Method: GET
- Responses

Success
```
{
  "title": "C++ beginners guide",
  "description": "The guide beginners love to read",
  "author": {
    "firstName": "john",
    "lastName": "doe",
    "email": "doe@gmai1.com",
    "_id": "6366f56243c3fbb0184f5e01"
  },
  "state": "published",
  "readCount": 1,
  "tags": [
    "game",
    "c++"
  ],
  "body": " The next step is the most complex. It’s where we take the text and then ",
  "_id": "63683295b7d556d832bb0a05",
  "readingTime": 1,
  "createdAt": "2022-11-06T22:17:57.914Z",
  "updatedAt": "2022-11-06T22:17:57.914Z",
  "__v": 0
}

```
---

### Get all user artilces

- Route: /users/:id/articles
- Method: GET
- Header: 
    - Authorization : Bearer{token}
- Query params: 
    - page (default: 1)
    - per_page (default: 10)
    - state (default: draft)
- Responses

Success
```
[{
  "title": "C++ beginners guide",
  "description": "The guide beginners love to read",
  "author": {
    "firstName": "john",
    "lastName": "doe",
    "email": "doe@gmai1.com",
    "_id": "6366f56243c3fbb0184f5e01"
  },
  "state": "draft",
  "readCount": 1,
  "tags": [
    "game",
    "c++"
  ],
  "body": " The next step is the most complex. It’s where we take the text and then ",
  "_id": "63683295b7d556d832bb0a05",
  "readingTime": 1,
  "createdAt": "2022-11-06T22:17:57.914Z",
  "updatedAt": "2022-11-06T22:17:57.914Z",
  "__v": 0
}
]
```
---

...

## Contributor
- John Ayebamondiafere Godwin
