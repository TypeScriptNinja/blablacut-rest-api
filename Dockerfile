FROM node:buster
WORKDIR /app

RUN apt update -y &&\
    apt install -y lsb-release libsndfile1 ffmpeg gpac && \
    wget https://people.debian.org/~paravoid/python-all/unofficial-python-all.asc && \
    mv unofficial-python-all.asc /etc/apt/trusted.gpg.d/ && \
    echo "deb http://people.debian.org/~paravoid/python-all $(lsb_release -sc) main" > /etc/apt/sources.list.d/python-all.list && \
    apt update -y && \
    apt install -y python3.6


ENV bbc_python_path env/bin/python3.6
ENV bbc_video_cutter_path video_cutter

COPY ./package*.json ./
RUN npm install
COPY . ./
RUN npm run prebuild
RUN npm run build
EXPOSE 3000

# paste python app to ./dist folder

CMD ["npm", "run", "start:prod"]