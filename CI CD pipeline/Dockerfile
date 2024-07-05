FROM gitlab/gitlab-ee:latest
RUN apt-get update && apt-get install -y software-properties-common
RUN apt-get update && \
  apt-get install -y gcc python-dev libkrb5-dev && \
  apt-get install python3-pip -y && \
  pip3 install ansible
