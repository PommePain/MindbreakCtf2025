FROM python:3.9.15-slim-bullseye

WORKDIR /space_url

COPY ./requirements.txt /space_url/requirements.txt
COPY ./flag.txt /flag.txt
COPY ./app /space_url/app

RUN useradd -ms /bin/bash user

RUN python3 -m venv /space_url/venv
RUN /space_url/venv/bin/pip install --upgrade pip
RUN /space_url/venv/bin/pip install -r /space_url/requirements.txt
RUN chown -R user:user /space_url /flag.txt

USER user
EXPOSE 7494

CMD ["/space_url/venv/bin/uvicorn", "app.server:app", "--host", "0.0.0.0", "--port", "7494"]