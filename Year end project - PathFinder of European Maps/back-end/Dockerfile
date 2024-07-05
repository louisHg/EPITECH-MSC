#FROM python:3

#RUN apt-get update && apt-get install -y software-properties-common
#RUN add-apt-repository ppa:deadsnakes/ppa
#RUN apt-get update
#RUN apt-get install -y postgresql-client
#RUN apt-get install python-numpy gdal-bin libgdal-dev
#WORKDIR /user/src/app
#COPY requirements.txt ./
#RUN pip install --no-cache-dir -r requirements.txt
#COPY . .
#CMD [ "sh", "/user/src/app/entrypoint.sh" ]

ARG GDAL=ubuntu-small-3.3.3
ARG PYTHON_VERSION=3.8
FROM osgeo/gdal:${GDAL} AS gdal
ARG PYTHON_VERSION
ENV LANG="C.UTF-8" LC_ALL="C.UTF-8"
RUN apt-get update && apt-get install -y software-properties-common
RUN add-apt-repository -y ppa:deadsnakes/ppa
RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    g++ \
    gdb \
    make \
    python3-pip \
    python${PYTHON_VERSION} \
    python${PYTHON_VERSION}-dev \
    python${PYTHON_VERSION}-venv \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /user/src/app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD [ "sh", "/user/src/app/entrypoint.sh" ]