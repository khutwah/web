PRE ?= stag
SHA ?= $(shell git rev-parse HEAD)
VER := $(shell git rev-parse --short $(SHA))
NAM ?= mh
REG ?= ttl.sh
TAG ?= 1h
IMG ?= $(REG)/$(NAM)-khutwah-id-$(SHA):$(TAG)

image:
	@docker build \
		--push \
		--platform linux/amd64 \
		--build-arg NEXT_PUBLIC_APP_VERSION=$(PRE)-$(VER) \
		-t $(IMG) .
