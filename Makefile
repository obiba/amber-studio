tag=snapshot
image=obiba/amber-studio:$(tag)

build:
	docker build -t $(image) .

run:
	docker run -p 3080:80 \
		-e AMBER_URL=http://localhost:3030 \
		-e RECAPTCHA_SITE_KEY='' \
		-e PATH_PREFIX='/' \
		$(image)

push:
	docker push $(image)

clean:
	docker rm $(docker ps -a -q --filter ancestor=$(image)) || true
	docker rmi $(image) || true