.PHONY: test build patch minor

test:
	node_modules/.bin/mocha test
	
patch: test
	npm version patch -m "Bump version"
	git push origin master --tags
	npm publish
	
minor: test
	npm version minor -m "Bump version"
	git push origin master --tags
	npm publish
