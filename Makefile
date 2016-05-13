PROFILE=
S3_STORAGE=s3://wxapps
USER=$(user)
GROUP=$(group)
TEMPDIR:= $(shell mktemp -d -t t)

ifdef profile
	PROFILE:=--profile $(profile)
endif

ifndef user
	USER:=$(shell whoami)
endif

ifndef group
	GROUP:=$(USER)
endif

.PHONY: build

dev:
	@npm run dev --verbose-url

test_deploy:
	@cp -r examples/* $(TEMPDIR)
	@echo 'copy examples to $(TEMPDIR)'
	@sed -i -e "s/^owner\:[ \-_a-zA-Z0-9]*$\/owner: $(USER)/" $(TEMPDIR)/deploy.yml
	@echo 'group: $(GROUP)' >> $(TEMPDIR)/deploy.yml
	@echo 'deploy configure'
	@cat $(TEMPDIR)/deploy.yml
	@echo
	@cd $(TEMPDIR);tar --exclude deploy.tar.gz --exclude deploy.tar.bz2 --exclude deploy.zip --exclude deploy.tar.xz -czvf /tmp/deploy-examples.tar.gz .
	@aws s3 cp /tmp/deploy-examples.tar.gz $(S3_STORAGE) $(PROFILE)

build: 
	@npm run build

upload: build
	@tar --exclude .git --exclude node_modules --exclude src --exclude examples -czf $(TEMPDIR)/deploy-agent.tar.gz .
	@aws s3 cp $(TEMPDIR)/deploy-agent.tar.gz s3://wanliu/deploy-agent/deploy-agent.tar.gz $(PROFILE)
