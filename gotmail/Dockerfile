FROM ubuntu:22.04

RUN useradd -d /home/challenger/ -m -p challenger -s /bin/bash challenger
RUN echo "challenger:challenger" | chpasswd

RUN apt-get update && apt-get install -y wget

WORKDIR /home/challenger

RUN wget https://github.com/LiveOverflow/pwn_docker_example/raw/refs/heads/master/challenge/ynetd -O /home/challenger/ynetd
RUN chmod +x /home/challenger/ynetd

COPY flag.txt gotmail launch_challenge.sh libc.so.6 ld-linux-x86-64.so.2 /home/challenger/
RUN chmod +x /home/challenger/gotmail
RUN chmod +x /home/challenger/launch_challenge.sh
RUN chown -R challenger:challenger /home/challenger/

USER challenger

EXPOSE 4444

CMD ["./ynetd", "-p", "4444", "./launch_challenge.sh"]
