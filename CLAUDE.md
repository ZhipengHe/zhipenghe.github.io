# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Jekyll-based academic website built on the al-folio theme, deployed to GitHub Pages. The site features a blog, publications, CV, projects, and other academic content.

## Development Commands

### Local Development

#### Docker Compose (Recommended)
```bash
# Start development server with live reload
docker compose up

# Use slim version (faster startup)
docker compose -f docker-compose-slim.yml up

# Build for production
docker compose run jekyll bundle exec jekyll build --config _config.yml

# Access site at http://localhost:8080
```

#### Native Ruby (Alternative)
```bash
# Install dependencies
bundle install

# Serve site locally with live reload
bundle exec jekyll serve --livereload

# Build for production
export JEKYLL_ENV=production
bundle exec jekyll build

# Purge unused CSS (after build)
purgecss -c purgecss.config.js
```

### Content Management
```bash
# Format code with Prettier
npx prettier --write .

# Add new blog post
# Create file in _posts/ with format: YYYY-MM-DD-title.md

# Schedule future posts
# Create file in _scheduled/ with format: YYYY-MM-DD-title.md
# The GitHub Action will automatically move scheduled posts to _posts/ daily at 18:00 UTC
```

## Architecture & Structure

### Core Directories
- `_posts/`: Published blog posts
- `_scheduled/`: Future posts (moved to _posts/ automatically by GitHub Actions)
- `_pages/`: Static pages (about, CV, publications, etc.)
- `_layouts/`: Page templates
- `_includes/`: Reusable components
- `_sass/`: Styling
- `_config.yml`: Main configuration
- `assets/`: Static assets (images, PDFs, etc.)

### Key Features
- **Scheduled Publishing**: Posts in `_scheduled/` are automatically published by GitHub Actions daily
- **Multi-format Support**: Supports Markdown, Jupyter notebooks, and Distill-style posts
- **Publication Management**: Uses Jekyll Scholar with BibTeX files in `_bibliography/`
- **Responsive Images**: Automatic WebP conversion with multiple sizes
- **Dark/Light Theme**: Built-in theme switching

### Content Types
- **Blog Posts**: Standard markdown in `_posts/` with YAML frontmatter
- **Publications**: Managed via `_bibliography/papers.bib`
- **Projects**: Collection in `_projects/`
- **News**: Collection in `_news/`

### Deployment
- **Production**: Automatic deployment via GitHub Actions on push to master
- **Staging**: Pull requests trigger preview builds
- **CDN**: Uses Jekyll plugins for optimized asset delivery

### Custom Plugins & Extensions
- Jekyll Scholar for publications
- Jekyll Archives for categorization
- Image optimization with ImageMagick
- Custom scheduled posting system via GitHub Actions

## Important Files
- `_config.yml`: Main site configuration
- `Gemfile`: Ruby dependencies
- `package.json`: Node.js dependencies for Prettier
- `.github/workflows/deploy.yml`: Main deployment pipeline
- `.github/workflows/schedule-posts.yml`: Automated post publishing
- `purgecss.config.js`: CSS optimization configuration