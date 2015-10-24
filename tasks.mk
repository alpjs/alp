.PHONY: check clean tests watch build

BIN = ''

# with npm run
ifeq ($(origin npm_package_version), undefined)
	BIN = node_modules/.bin/
endif

check:
	mkdir -p lib/config public/js/config || echo

clean:
	rm -Rf lib tests/lib public/*.css public/js

default: check
	@node_modules/.bin/gulp

watch: check
	@node_modules/.bin/gulp watch

build: check
	@node_modules/.bin/gulp build


lint:
	@echo "> Lint files"
	@if [ -a .jshintrc ]; \
	then \
		echo '>> jshint'; \
		$(BIN)jshint -c .jshintrc --reporter node_modules/jshint-stylish src/ tests/src/; \
	fi
	@echo '>> jscs';
	@$(BIN)jscs -c .jscsrc src/ tests/src/
	@if [ -a .eslintrc ]; \
	then \
		echo '>> eslint'; \
		$(BIN)eslint -c .eslintrc src/ tests/src/; \
	fi

lint-fix:
	$(BIN)jscs -x -c .jscsrc src/ tests/src/

tests:
	@echo "> Building"
	$(BIN)babel -s --out-dir tests/lib tests/src
	@echo "> Run tests"
	$(BIN)mocha --harmony --es_staging --recursive --bail -u tdd tests/lib
