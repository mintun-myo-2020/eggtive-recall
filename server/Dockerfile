FROM golang:1.18

WORKDIR /app

COPY . /app

RUN go build -o main .

EXPOSE 8080

CMD ["./main"]
