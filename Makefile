all: package

package:
	serverless package

deploy:
	serverless deploy

remove:
	serverless remove

install:
	yarn install

lint:
	yarn lint:src:fix

offline:
	serverless offline