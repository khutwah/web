PRE ?= stag
REF ?= $(shell git rev-parse HEAD)
VER := $(shell git rev-parse --short $(REF))
NAM ?= mh
ENV ?= development
REG ?= ttl.sh
TAG ?= 1h
IMG ?= $(REG)/$(NAM)-${ENV}-khutwah-id-$(REF):$(TAG)

image:
	@docker build \
		--push \
		--platform linux/amd64 \
		--build-arg NEXT_PUBLIC_APP_VERSION=$(PRE)-$(VER) \
		-t $(IMG) .
