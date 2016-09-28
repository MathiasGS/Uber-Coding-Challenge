# Uber Coding Challenge: Email Service

Build a reliable email sending service which is capable of quickly switching between email service providers if one goes down.

In my interpretation, this challenge is about ensuring reliable email sending, even if a service goes down, quotas are exceeded etc. To meet this criterion, this solution is designed to be scaleable and resilient to mail service outages.

## Details
This project is for an Uber interview. It implements the Email Service challenge outlined in https://github.com/uber/coding-challenge-tools/blob/master/coding_challenge.md.

I have chosen the fullstack track in order to show off both frontend and backend experience.

The project is hosted on Azure: http://ubercodingchallenge.azurewebsites.net.

# Architecture and Design
The solution is designed with a strong client-server achitecture as required in the challenge. Primarily, is consists of the following parts implemented using the outlined technologies:

- Frontend: Polymer,
- Backend: NodeJS and TypeScript,
- Data storage: Azure Table Storage

## Frontend
The frontend is implemented as a Polymer application. Polymer is a quick library for building modern web applications quickly and with a high degree of reuse of external components, which was particularly useful given the time constraints. 
Limited responsiveness was added to the layout to accomodate mobile devices.
An OTS WYSIWYG-editor was used, but is encapsulated in a custom element to allow subsequent replacement.

Basic vulcanize-ation is applied to ensure acceptable load time of the application by combining imported files (alternatively there would be a large number of HTTP requests which would only be triggered when the importer is parsed at the client). Further improvements can be achieved e.g. with aditional minification, by serving the files using a caching proxy like nginx or evaluating the cache headers. I have not focused on this part in my solution.

Relevant files to review: /client/elements.

Experience: I have used Polymer for a couple of hobby projects.

## Backend
NodeJS, being event-driven and asynchronous by design, is a good candidate for handling a large amount if incoming and outgoing connections. 
TypeScript provides a better structure to development by providing e.g. OOP and more elaborate language features on top of JavaScript.

Relevant files to review: /server (except /server/typings).

Experience: I have used TypeScript professionally and used NodeJS for a couple of hobby projects.

The backend consists of three parts in order to meet the goal of scalability and availability:

### Servicing of frontend
This part has not been given particular focus as previously argued.

### REST-interface for frontend interaction
The backend provides a REST interface for the frontend to send messages and retrieve status of messages.

The REST interface handlers persists and retrieves messages from the data storage, but does not perform the actual sending.
This design decission is made to ensure availability and reliability, even when all mail sending services are down, and responsiveness so that the response of the REST service does not rely on a number of (unreliable and potentially slow) outgoing HTTP requests to return a response.

### Mail sending workers
A number of workers are put to work performing the actual sending of messages queued in the datastorage. 

A benefit of this architecture is the ability to vertically scale the number of workers and REST interface servers independently. Workers can be added quickly and effortlessly on new hosts to achieve higher throughput.
Another benefit of this design is the ability to add even more resilience, e.g. retry sending at a later time if all mail sending services are down (in the current implementation, due to time constraints and scope, all services down/failing equals rejection).

Notification of workers from the send handler is implemented to reduce latency in cases where all (local) workers are sleeping due to lack of work.

## Data Storage
I picked Azure Table Storage based on the assumption that it is required to always be able to tell if a message is sent (messages and send status are persistent) and because it provided the necessary capabilities with regards to locking for concurrent workers (email sending is not idempotent!).

One may argue that e.g. a Queue-based storage might be relevant for this scenario. Due to time constraints and the assumed requirement to persist messages and send statuses this was not explored further. However, the data storage is isolated so that it is possible to replace the implementation at a later point in time.

[![Known Vulnerabilities](https://snyk.io/test/github/mathiasgs/uber-coding-challenge/958f822988cad82e57f73ddcbc93baa049c085d0/badge.svg)](https://snyk.io/test/github/mathiasgs/uber-coding-challenge/958f822988cad82e57f73ddcbc93baa049c085d0)