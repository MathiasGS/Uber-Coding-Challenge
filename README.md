# Uber Coding Challenge: Email Service
Challenge: Build a reliable email sending service which is capable of quickly switching between email service providers if one goes down.

In my interpretation, this challenge is about ensuring reliable email sending, even if a service goes down, quotas are exceeded etc. To meet this criterion, this solution is designed to be scaleable, available and resilient to mail service outages.

## Details
This project is for an Uber interview. It implements the Email Service challenge outlined in https://github.com/uber/coding-challenge-tools/blob/master/coding_challenge.md.

I have chosen the fullstack track in order to show off both frontend and backend experience.

The project is hosted on Azure: http://ubercodingchallenge.azurewebsites.net.

## Further Work
Due to time constraints, there are many remaining topics for further work, a few of which include:

- Adding telemetry. Particularly useful for scaling workers.
- Error handling and improved robustness.
- Performance tuning of workers (batch sizes, sleep durations, number of workers contra number of pending messages).
- Find or build a better WYSIWYG editor.
- Adding BCC to a monitored mailbox on all outgoing messages could be used to validate if messages are indeed delivered by third party.

### Security
I have focused on using external components with a large user base to justify basic reliability and security assumptions. Dependencies are scanned for known vulnerabilities using snyk.io.

[![Known Vulnerabilities](https://snyk.io/test/github/mathiasgs/uber-coding-challenge/badge.svg)](https://snyk.io/test/github/mathiasgs/uber-coding-challenge)

An obvious neglection in the solution is not to use HTTPS. I have not prioritized configuration of this due to time constrains, but would have set up the Azure deployment to automatically renew and use certificates from Let's Encrypt (which I have done for one of my hobby projects: https://homeio.net). As this is primarily a matter of configuration, I considered it a non-priority.

# Architecture and Design
The solution is designed with a strong client-server achitecture as required in the challenge. Primarily, it consists of the following parts implemented using the outlined technologies:

- Frontend: Polymer,
- Backend: NodeJS and TypeScript,
- Data storage: Azure Table Storage

## Frontend
The frontend is implemented as a Polymer application. Polymer is developed, used and maintained by Google, which justifies basic reliability assumptions. It provides a number of components for quickly building modern web applications.
Limited responsiveness was added to the layout to accommodate mobile devices.
An OTS WYSIWYG-editor was used, but is encapsulated in a custom element to allow subsequent replacement. Manuel testing showed some reliability issues with this, particularly on Chrome and IE. Due to time constraints, I have not investigated a more robust alternative (or made one from scratch).

Basic vulcanize-ation is applied to ensure acceptable load time of the application by combining imported files (alternatively, there would be a large number of HTTP requests which would only be triggered when the importer is parsed or used at the client, introducing a lot of latency). Further improvements can be achieved e.g. with aditional minification, by serving the files using a fast, caching proxy like nginx, optimizing caching or using HTTP/2 Server Push. I have not focused particularly on this part in my solution.

Relevant files to review: /client/elements.

Experience: I have used Polymer for a couple of hobby projects.

## Backend
NodeJS, providing event-driven and non-blocking I/O by design, is a good candidate for handling a large amount of incoming and outgoing connections.
TypeScript provides improved code structure and readability compared to JavaScript.

Relevant files to review: /server (except /server/typings).

Experience: I have used TypeScript professionally and used NodeJS for a couple of hobby projects.

### REST Interface for Frontend Interaction
The backend provides a REST interface for the frontend to send messages and retrieve status of messages based on UUIDs.

The REST interface servers persist and retrieve messages from the data storage, but do not perform the actual sending. This task is performed by mail service workers.

This architecture is designed specifically to meet the goals of:
- Availability: limited work done by REST interface servers and simple to load balance with more servers.
- Responsiveness: the response of the REST service does not depend on a number of (unreliable and slow) outgoing HTTP requests.
- Reliability: even when all mail sending services are down, we can receive mail requests.
- Scaleability: REST interface servers and mail sending workers can be scaled horizontally and independently (with load balancing required for REST interface servers).

### Mail Sending Workers
A number of workers are put to work performing the actual sending of messages pending in the datastorage.

Workers are designed to handle concurrent races for pending messages, hence horizontal scaling of worker nodes can be achieved with no coordination and is done simply by adding more instances.

This architecture also enables adding more resilience to the solution, e.g. by retrying sending at a later time if all mail sending services are down (in the current implementation, due to time constraints and scope, all services down/failing at time of sending equals rejection).

Notification of workers from the send handler is implemented to reduce latency in cases where all (local) workers are sleeping due to lack of work.

## Data Storage
Azure Table Storage is used based on the assumption that it is required to always be able to tell if a message is sent (messages and send status are persisted) and because it provided the necessary capabilities with regards to locking for concurrent workers (email sending is not idempotent!).

One may argue that e.g. a Queue-based storage might be relevant for this scenario. Due to time constraints and the assumed requirement to persist messages and send statuses, this was not explored further. However, the data storage is isolated so that it is possible to replace the implementation at a later point in time.

Experience: I have used Azure Table Storage in a couple of hobby projects.

# Build and Installation
- Dependencies are installed with the installation script using "npm install".
- TypeScript/server compilation can be executed using "npm run build".
- Client vulcanization is executed using "npm run vulcanize".
- The project may be run locally using "sudo npm start".

The /build folder containes a precompiled version of the project. This folder is included to facilitate automatic deployment to Azure.

# Testing
Some automated tests can be found in /test. The tests can be executed using "npm run test". No automated testing has been implemented for the frontend. There is obviously room for additional testing, in particular it would be relevant to test the Azure Table Storage adapter (which can be achieved using the Azure Storage Emulator) and the mail sending adapters.

Basic manual testing in various browsers has been performed on a Mac and using browserstack.com. Safari and Firefox passed. Chrome and IE showed an issue related to event handling in third party Polymer input elements and issues with the WYSIWYG editor (e.g. backspace not working as intended). A workaround has been implemented for the input element issue, the WYSIWYG editor problems have not been adressed due to time constraints.