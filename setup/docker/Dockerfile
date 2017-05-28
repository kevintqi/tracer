FROM node:6.3-slim
MAINTAINER tracker 
RUN mkdir service && groupadd -r app && useradd -r -g app app && chown app /service
USER app
COPY service.tgz /service/
RUN cd /service && tar xvf service.tgz && rm service.tgz && cd package
USER root
RUN cd /service/package && npm set registry https://registry.npmjs.org/ && npm install --production
USER app
EXPOSE 3000 
WORKDIR /service/package
ENTRYPOINT ["node", "bin/www"]