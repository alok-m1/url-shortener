# URL Shortener

A simple URL shortener service written in Go.

## Prerequisites

- Go 1.21+ (`go version`)

## Getting Started

```bash
# init module (if not already done)
go mod init example.com/url-shortner

# run
go mod tidy
go run .

# build
go build -o app .
```

## Project Structure

```
.
├── main.go       # entrypoint
├── go.mod
├── go.sum
└── README.md
```

## API (planned)

- `POST /shorten` - `{ "url": "https://example.com" }` -> `{ "short": "abc123" }`
- `GET /{short}` - redirect to original URL

## License

MIT
