build:
	docker build -t amber-studio:snapshot .

run:
	docker run -p 3080:80 \
		-e AMBER_URL=http://localhost:3030 \
		-e RECAPTCHA_SITE_KEY='' \
		-e PATH_PREFIX='/' \
		amber-studio:snapshot

clean:
	docker rm $(docker ps -a -q --filter ancestor=amber-studio:snapshot) || true
	docker rmi amber-studio:snapshot || true