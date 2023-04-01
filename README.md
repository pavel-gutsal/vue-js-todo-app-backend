<!-- explanation -->
--target  --> either dev or prod
--tag  --> name of image
.  --> context / dir / directory where file is located

<!-- command -->
docker build --target dev --tag nest-docker .


<!-- explanation -->

--detach  --> detach from built in integrated terminal

4250:4250  --> exposing port

<!-- command -->
docker run --detach --publish 4250:4250 nest-docker

<!-- command to start in watch mode-->
docker-compose up --build

<!-- WARNING-->
package.json   "typescript": "^4.7.4"  WAS CHANGED TO    "typescript": "~4.7.4"

**to connect to pgadmin4 visit localhost:5050, 
  modal window. connection 
  hostName:  db
  port: 5432
  username: postgres
  password: postgres