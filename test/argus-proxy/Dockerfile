FROM argus-node

ADD app app
ADD scripts scripts

WORKDIR app

RUN /scripts/prepare

ENTRYPOINT [ "argus-node" ]