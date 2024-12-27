PRE ?= stag
SHA ?= $(shell git rev-parse HEAD)
VER := $(shell git rev-parse --short $(SHA))

image:
	@docker build \
		--push \
		--platform linux/amd64 \
		--build-arg NEXT_PUBLIC_APP_VERSION=$(PRE)-$(VER) \
		--build-arg NEXT_PUBLIC_CACHE_BUSTER=$(VER) \
		-t ttl.sh/mh-khutwah-id-$(SHA):1h .
