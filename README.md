# Visual Atlas

A small, data-first visual research archive.

The atlas is meant to remember more than finished images. Each object records a visual question, an observation, materials, provenance, status, and relationships to other objects.

## MVP

The first version is deliberately small:

- one JSON data source: `data/atlas.json`
- one object contract: `schema/object.schema.json`
- a zero-dependency static interface
- search by any indexed text
- filters by object type
- detail views for each record
- explicit links between related object IDs
- three demo records to replace with real entries

The useful unit is an **atlas object**, not an image file.

```text
OBSERVE
   ↓
REFERENCE
   ↓
EXPERIMENT
   ↓
WORK
   ↓
SERIES
   ↓
PUBLISHED
```

Objects can also connect sideways: a specimen can link to a material test, palette, source, observation, or finished work.

## Object types

The MVP accepts:

- `specimen`
- `work`
- `experiment`
- `material-test`
- `palette`
- `reference`
- `observation`
- `series`

The schema is intentionally conservative. New fields should be added only after real use shows they are necessary.

## Add an object

Add a record to the `objects` array in `data/atlas.json`.

Example:

```json
{
  "id": "OBS-002",
  "title": "Branching Ice",
  "kind": "observation",
  "date": "2026-09-25",
  "status": "observed",
  "public": true,
  "summary": "Directional crystal growth seen across a cold window.",
  "visualQuestion": "Which branching rules survive when the structure is simplified?",
  "observation": "The dense center and sparse terminal branches carry most of the visual identity.",
  "materials": [],
  "tags": ["ice", "branching", "growth"],
  "source": null,
  "relations": []
}
```

### Minimum useful record

Do not fill fields just because they exist. For a useful entry, answer:

```text
what is it?
when was it observed or made?
what question was being tested?
what was learned?
what material or source matters?
what does it connect to?
```

## Run locally

Because the interface fetches JSON, use a local web server rather than opening `index.html` directly.

With Python:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

No package install or build step is required.

## Repository structure

```text
visual-atlas/
├── index.html
├── styles.css
├── app.js
├── data/
│   └── atlas.json
├── schema/
│   └── object.schema.json
├── README.md
└── LICENSE
```

## Design rule

Portfolio = what was made.

Archive = what was kept.

**Visual Atlas = what was learned from looking and making.**

The atlas should not become a productivity tracker. Prefer causal observations and reusable knowledge over counts, streaks, or completion metrics.

## Next after MVP

Use the current version first. Good next additions would be driven by actual friction: image assets, richer source provenance, typed relations, automatic schema validation, or a generated public/private view. They are intentionally not part of v0.1.
