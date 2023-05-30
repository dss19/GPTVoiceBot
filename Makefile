build:
    docker build -t mybot .

run:
    docker run -d -p 3000:3000 --name mybot --rm mybot
