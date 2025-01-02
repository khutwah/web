PRE ?= stag
REF ?= $(shell git rev-parse HEAD)
VER := $(shell git rev-parse --short $(REF))
NAM ?= mh
ENV ?= development
REG ?= ttl.sh
TAG ?= 1h
IMG ?= $(REG)/$(NAM)-${ENV}-khutwah-id-$(REF):$(TAG)

# NEXT_PUBLIC_APP_*
VERSION     ?= $(PRE)-$(VER)
NAMESPACE   ?= $(NAM)
TITLE       ?= Minhajul Haq
DESCRIPTION ?= Minhajul Haq Pusat Studi Islam dan Bahasa Arab

image:
	docker build \
		--push \
		--platform linux/amd64 \
		--build-arg NEXT_PUBLIC_APP_VERSION=$(VERSION) \
		--build-arg NEXT_PUBLIC_APP_NAMESPACE=$(NAMESPACE) \
		--build-arg NEXT_PUBLIC_APP_TITLE="$(TITLE)" \
		--build-arg NEXT_PUBLIC_APP_DESCRIPTION="$(DESCRIPTION)" \
		-t $(IMG) .
