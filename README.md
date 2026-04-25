# Vinkom Website

## What this is
A fully functional multi-page promotional website built for a real client, featuring dynamic content rendering, user interaction flows, and a structured frontend architecture.

## Why I built it
This project was developed to create a scalable and maintainable web presence with interactive features such as booking, trade-in, and user inquiry flows. The goal was to move beyond static pages and build a system that is easy to update and extend.

## Tech Stack
- HTML5
- Tailwind CSS
- Vanilla JavaScript
- JSON (data-driven content)

## Features
- Multi-page responsive website (home, about, blog, models, FAQ, etc.)
- Dynamic content loading using JSON data
- User interaction flows:
  - Booking system
  - Trade-in form
  - Multiple confirmation and thank-you flows
- Reusable JavaScript components (includes/) for shared layout and logic
- Tailwind CSS workflow with custom configuration
- Structured and scalable project architecture

## Architecture and Structure
- Separation of content and logic using JSON (data/)
- Modular JavaScript for reusable UI components
- Clear page-based structure for scalability
- Tailwind-based styling pipeline (input.css → output.css)

## Setup

1. Install dependencies:
   npm install

2. Start Tailwind in watch mode:
   npm run dev

3. Open any .html file in a browser or run a local server (e.g. Live Server).

## What I learned
- Structuring a frontend project for real-world scalability
- Building reusable components without frameworks
- Managing dynamic content with JavaScript and JSON
- Designing user flows for real interactions (forms and confirmations)
- Working with Tailwind CSS in a production-like workflow

## Notes
- output.css is generated from input.css using Tailwind
- JSON-based content allows updates without modifying core logic
- The project avoids heavy frameworks to maintain control and performance
