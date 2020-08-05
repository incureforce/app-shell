FROM alpine

ADD scripts scripts

RUN /scripts/prepare

ENTRYPOINT [ "argus-node" ]