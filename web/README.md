# Researcher Kit — web UI

Next.js app that serves the three skills in a browser. Skill prompts and `standards/` are read from the repository layout at runtime (or from `RESEARCHER_KIT_ROOT` in Docker).

## Development

From this directory:

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production

Prefer the **Dockerfile at the repository root** (builds standalone Next.js and bundles `.claude/` + `standards/`). See the main [README.md](../README.md#run-with-docker).

```bash
cd ..
docker build -t researcher-kit .
docker run --rm -p 3000:3000 researcher-kit
```

## Learn more

- [Next.js Documentation](https://nextjs.org/docs)
