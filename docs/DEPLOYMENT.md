# Deployment

Run npm run build and publish dist/.

## Cloudflare Pages

Connect the repository, set build command to npm run build, and output folder to dist. No environment variables are needed.

## GitHub Pages

Publish the contents of dist using a Pages deployment workflow. Asset paths are relative, so the site can be mounted below a repository path.

## Other static hosts

Upload index.html, src/, and creatures/ from dist. Serve .svg as image/svg+xml and .js as JavaScript modules.
